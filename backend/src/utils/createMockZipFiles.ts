import fs from 'fs';
import path from 'path';

export const ensureProtectedStorageDirectories = () => {
  const storageDir = path.resolve(__dirname, '../../storage/protected/packages');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
    console.log(`[STORAGE] Created protected storage directory: ${storageDir}`);
  }

  const packages = [
    'ai-resume-analyzer-v1.zip',
    'ai-interview-prep-v1.zip',
    'mern-ecommerce-v1.zip',
    'hospital-mgmt-v1.zip',
    'job-portal-v1.zip',
    'sample-project.zip',
  ];

  for (const pkg of packages) {
    const pkgPath = path.join(storageDir, pkg);
    if (!fs.existsSync(pkgPath)) {
      const mockZipContent = `PK\x03\x04 - PROJECTFORGE SECURE DOWNLOAD PACKAGE (${pkg})\n\nIncluded Deliverables:\n1. Source Code (Frontend & Backend)\n2. Database Schemas\n3. System Architecture PDF\n4. Presentation PPTX\n5. Viva Questions & Setup Guide\n\nThank you for choosing ProjectForge! Build. Understand. Showcase.`;
      fs.writeFileSync(pkgPath, mockZipContent);
      console.log(`[STORAGE] Created mock zip package file: ${pkg}`);
    }
  }
};

if (require.main === module) {
  ensureProtectedStorageDirectories();
}
