import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录
const rootDir = path.resolve(__dirname, '..');

// 要清理的目录
const distDir = path.join(rootDir, 'dist');

// 检查dist目录是否存在
if (fs.existsSync(distDir)) {
  console.log('清理dist目录...');
  
  // 递归删除目录
  function deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        
        if (fs.lstatSync(filePath).isDirectory()) {
          // 递归删除子目录
          deleteDirectory(filePath);
        } else {
          // 删除文件
          fs.unlinkSync(filePath);
        }
      });
      
      // 删除空目录
      fs.rmdirSync(dirPath);
    }
  }
  
  deleteDirectory(distDir);
  console.log('dist目录清理完成');
} else {
  console.log('dist目录不存在，无需清理');
}