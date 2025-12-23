
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/styles/main.css');
const fileContent = fs.readFileSync(filePath, 'utf8');
const lines = fileContent.split('\n');

// We want to remove lines from 1579 to 1779 (1-based)
// In 0-based array: index 1578 to 1778.
const startLine0 = 1578;
const endLine0 = 1778; // Inclusive of deletion

console.log('Total lines before:', lines.length);
if (lines.length < endLine0) {
    console.error('File shorter than expected, aborting.');
    process.exit(1);
}

// Verify context
console.log('Line 1579 starts with:', lines[startLine0].trim());
console.log('Line 1779 ends with:', lines[endLine0].trim());

// Splice out the duplicates
// count = 1778 - 1578 + 1 = 201 lines
lines.splice(startLine0, (endLine0 - startLine0 + 1));

// Insert the closing brace for the media query
lines.splice(startLine0, 0, '}');

// Write back
const newContent = lines.join('\n');
fs.writeFileSync(filePath, newContent);
console.log('Fixed main.css. Total lines now:', newContent.split('\n').length);
