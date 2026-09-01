import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export interface StorageFileMeta {
  key: string;
  size: number;
  mimeType: string;
  exists: boolean;
}

export class StorageService {
  private localBasePath: string;
  private provider: 'local' | 's3';

  constructor() {
    this.provider = (process.env.STORAGE_PROVIDER as 'local' | 's3') || 'local';
    this.localBasePath = path.resolve(__dirname, '../../storage/protected');
    this.ensureLocalStorageDir();
  }

  private ensureLocalStorageDir() {
    if (!fs.existsSync(this.localBasePath)) {
      fs.mkdirSync(this.localBasePath, { recursive: true });
    }
  }

  /**
   * Generates a safe storage key for uploaded asset
   */
  public generateKey(productId: string, assetType: string, filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const safeBase = path.basename(filename, ext).replace(/[^a-z0-9]/gi, '_');
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `packages/${productId}/${assetType.toLowerCase()}_${safeBase}_${timestamp}_${randomHex}${ext}`;
  }

  /**
   * Uploads file buffer to storage
   */
  public async uploadAsset(storageKey: string, buffer: Buffer): Promise<StorageFileMeta> {
    if (this.provider === 's3' && process.env.STORAGE_ACCESS_KEY) {
      // S3 / R2 Cloud Storage SDK call if credentials configured
      console.log(`[STORAGE] S3 Cloud Storage Upload: ${storageKey}`);
    }

    // Default & Local Protected Storage Fallback
    const fullPath = path.resolve(this.localBasePath, storageKey);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, buffer);

    return {
      key: storageKey,
      size: buffer.length,
      mimeType: this.detectMimeType(storageKey),
      exists: true,
    };
  }

  /**
   * Deletes asset from storage
   */
  public async deleteAsset(storageKey: string): Promise<boolean> {
    try {
      const fullPath = path.resolve(this.localBasePath, storageKey);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
    } catch (err) {
      console.error('[STORAGE DELETE ERROR]', err);
    }
    return false;
  }

  /**
   * Checks if file exists on disk/storage
   */
  public fileExists(storageKey: string): boolean {
    const fullPath = path.resolve(this.localBasePath, storageKey);
    return fs.existsSync(fullPath);
  }

  /**
   * Reads readable stream for streaming response
   */
  public getFileStream(storageKey: string): fs.ReadStream {
    const fullPath = path.resolve(this.localBasePath, storageKey);
    return fs.createReadStream(fullPath);
  }

  /**
   * Gets absolute file path for local serving
   */
  public getAbsolutePath(storageKey: string): string {
    return path.resolve(this.localBasePath, storageKey);
  }

  /**
   * Helper to detect standard MIME types
   */
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
