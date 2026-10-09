import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

export interface StorageFileMeta {
  key: string;
  size: number;
  mimeType: string;
  exists: boolean;
}

export class StorageService {
  private localBasePath: string;
  private provider: 'local' | 's3' | 'supabase';
  private s3Client: S3Client | null = null;
  private supabaseClient: SupabaseClient | null = null;
  private bucketName: string;

  constructor() {
    this.provider = (process.env.STORAGE_PROVIDER as 'local' | 's3' | 'supabase') || 'local';
    this.localBasePath = path.resolve(__dirname, '../../storage/protected');
    this.bucketName = process.env.STORAGE_BUCKET_NAME || process.env.R2_BUCKET_NAME || process.env.SUPABASE_BUCKET_NAME || 'campusget-storage';

    const accessKeyId = process.env.STORAGE_ACCESS_KEY || process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.STORAGE_SECRET_KEY || process.env.R2_SECRET_ACCESS_KEY;
    const endpoint = process.env.STORAGE_ENDPOINT || process.env.R2_ENDPOINT;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    // 1. Check Supabase Storage Credentials
    if (supabaseUrl && supabaseKey) {
      this.provider = 'supabase';
      this.supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('[STORAGE] Supabase Storage Client Initialized.');
    }
    // 2. Check S3 / Cloudflare R2 Credentials
    else if ((this.provider === 's3' || endpoint) && accessKeyId && secretAccessKey) {
      this.provider = 's3';
      this.s3Client = new S3Client({
        region: process.env.STORAGE_REGION || 'auto',
        endpoint: endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      console.log('[STORAGE] S3 / Cloudflare R2 Client Initialized.');
    } else {
      this.ensureLocalStorageDir();
    }
  }

  private ensureLocalStorageDir() {
    if (!fs.existsSync(this.localBasePath)) {
      fs.mkdirSync(this.localBasePath, { recursive: true });
    }
  }

  public generateKey(productId: string, assetType: string, filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const safeBase = path.basename(filename, ext).replace(/[^a-z0-9]/gi, '_');
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `packages/${productId}/${assetType.toLowerCase()}_${safeBase}_${timestamp}_${randomHex}${ext}`;
  }

  public async uploadAsset(storageKey: string, buffer: Buffer): Promise<StorageFileMeta> {
    const mimeType = this.detectMimeType(storageKey);

    // 1. Always save copy to local disk cache for 0ms instant local streaming
    try {
      const fullPath = path.resolve(this.localBasePath, storageKey);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, buffer);
    } catch (localWriteErr) {
      console.warn('[STORAGE LOCAL DISK WRITE WARNING]', localWriteErr);
    }

    // 2. Upload to Supabase Cloud Storage
    if (this.supabaseClient) {
      try {
        console.log(`[STORAGE] Uploading to Supabase Bucket (${this.bucketName}): ${storageKey}`);
        const { error } = await this.supabaseClient.storage
          .from(this.bucketName)
          .upload(storageKey, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (error) {
          console.error('[STORAGE SUPABASE UPLOAD ERROR]', error);
        }
      } catch (supaErr) {
        console.error('[STORAGE SUPABASE EXCEPTION, FALLING BACK]', supaErr);
      }
    }

    // 3. S3 / Cloudflare R2 Upload
    if (this.s3Client) {
      try {
        console.log(`[STORAGE] Uploading to S3/R2 Bucket (${this.bucketName}): ${storageKey}`);
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: storageKey,
            Body: buffer,
            ContentType: mimeType,
          })
        );
      } catch (s3Err) {
        console.error('[STORAGE S3 UPLOAD ERROR, FALLING BACK TO LOCAL]', s3Err);
      }
    }

    return {
      key: storageKey,
      size: buffer.length,
      mimeType,
      exists: true,
    };
  }

  public async deleteAsset(storageKey: string): Promise<boolean> {
    if (this.supabaseClient) {
      try {
        await this.supabaseClient.storage.from(this.bucketName).remove([storageKey]);
        return true;
      } catch (err) {
        console.error('[STORAGE SUPABASE DELETE ERROR]', err);
      }
    }

    if (this.s3Client) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: storageKey,
          })
        );
        return true;
      } catch (err) {
        console.error('[STORAGE S3 DELETE ERROR]', err);
      }
    }

    try {
      const fullPath = path.resolve(this.localBasePath, storageKey);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
    } catch (err) {
      console.error('[STORAGE LOCAL DELETE ERROR]', err);
    }
    return false;
  }

  public fileExists(storageKey: string): boolean {
    const fullPath = path.resolve(this.localBasePath, storageKey);
    return fs.existsSync(fullPath);
  }

  public getFileStream(storageKey: string): fs.ReadStream {
    const fullPath = path.resolve(this.localBasePath, storageKey);
    return fs.createReadStream(fullPath);
  }

  public async getCloudObjectStream(storageKey: string): Promise<Readable | null> {
    if (this.supabaseClient) {
      // 1. Try SDK Download
      try {
        const { data, error } = await this.supabaseClient.storage
          .from(this.bucketName)
          .download(storageKey);

        if (data && !error) {
          const arrayBuffer = await data.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          if (buffer.length > 0) {
            return Readable.from(buffer);
          }
        } else if (error) {
          console.error('[STORAGE SUPABASE SDK DOWNLOAD ERROR]', error);
        }
      } catch (err) {
        console.error('[STORAGE SUPABASE DOWNLOAD EXCEPTION]', err);
      }

      // 2. Fallback to Direct Supabase Public CDN HTTP Fetch
      try {
        const { data: publicData } = this.supabaseClient.storage
          .from(this.bucketName)
          .getPublicUrl(storageKey);

        if (publicData?.publicUrl) {
          console.log(`[STORAGE SUPABASE] Attempting CDN Fetch: ${publicData.publicUrl}`);
          const cdnRes = await fetch(publicData.publicUrl);
          if (cdnRes.ok) {
            const arrayBuffer = await cdnRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            if (buffer.length > 0) {
              return Readable.from(buffer);
            }
          } else {
            console.error(`[STORAGE SUPABASE CDN FETCH FAILED] Status ${cdnRes.status} for ${publicData.publicUrl}`);
          }
        }
      } catch (cdnErr) {
        console.error('[STORAGE SUPABASE CDN FETCH EXCEPTION]', cdnErr);
      }
    }

    if (this.s3Client) {
      try {
        const response = await this.s3Client.send(
          new GetObjectCommand({
            Bucket: this.bucketName,
            Key: storageKey,
          })
        );
        return (response.Body as Readable) || null;
      } catch (err) {
        console.error('[STORAGE S3 GET OBJECT ERROR]', err);
      }
    }
    return null;
  }

  public getAbsolutePath(storageKey: string): string {
    return path.resolve(this.localBasePath, storageKey);
  }

  public detectMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.pdf':
        return 'application/pdf';
      case '.ppt':
        return 'application/vnd.ms-powerpoint';
      case '.pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case '.zip':
        return 'application/zip';
      case '.rar':
        return 'application/x-rar-compressed';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  }
}

export const storageService = new StorageService();
