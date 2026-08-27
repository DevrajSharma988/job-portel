import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.resolve('src/pages');

function fixImports(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Fix imports pointing to shared, ui, or other component folders
      // Examples: import from '../shared/...' -> import from '../../components/shared/...'
      content = content.replace(/from\s+['"]\.\.\/(shared|ui|admin|auth)(.*)['"]/g, "from '../../components/$1$2'");
      
      // For Home.jsx (which is directly in pages/)
      // import from './shared/...' -> import from '../components/shared/...'
      if (directory === PAGES_DIR) {
          content = content.replace(/from\s+['"]\.\/(shared|ui)(.*)['"]/g, "from '../components/$1$2'");
      }

      fs.writeFileSync(fullPath, content);
    }
  }
}

fixImports(PAGES_DIR);
console.log('Fixed relative imports in pages!');
