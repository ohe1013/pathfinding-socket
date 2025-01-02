import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = "./dist";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addJsExtensions(fullPath);
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(
        /import (.+?) from "(\..+?)";/g,
        'import $1 from "$2.js";'
      );
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

// 빌드 디렉토리 경로
const distDir = path.join(__dirname, "dist");
addJsExtensions(distDir);
