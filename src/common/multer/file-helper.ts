import * as fs from 'fs';
import * as path from 'path';

export const deleteFile = (folder: string, filename: string): void => {
  if (!filename) return;

  const filePath = path.join('./uploads', folder, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
