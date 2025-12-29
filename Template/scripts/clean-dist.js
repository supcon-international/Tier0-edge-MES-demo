import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const distDir = path.join(rootDir, "dist")

if (fs.existsSync(distDir)) {
  console.log("清理dist目录...")

  function deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)

      files.forEach((file) => {
        const filePath = path.join(dirPath, file)

        if (fs.lstatSync(filePath).isDirectory()) {
          deleteDirectory(filePath)
        } else {
          fs.unlinkSync(filePath)
        }
      })

      fs.rmdirSync(dirPath)
    }
  }

  deleteDirectory(distDir)
  console.log("dist目录清理完成")
} else {
  console.log("dist目录不存在，无需清理")
}

