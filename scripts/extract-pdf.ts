import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

const parse = (pdf as any).default || pdf;

const RAW_DATA_DIR = path.join(process.cwd(), 'data', 'input');

async function extractPdf(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await parse(dataBuffer);
  return data.text;
}

async function main() {
  if (!fs.existsSync(RAW_DATA_DIR)) {
    console.log(`Directory ${RAW_DATA_DIR} does not exist.`);
    console.log('Create data/input/ and place your PDFs there.');
    return;
  }

  const files = fs.readdirSync(RAW_DATA_DIR).filter(f => f.endsWith('.pdf'));

  if (files.length === 0) {
    console.log('No PDF files found in data/input/');
    return;
  }

  console.log(`Found ${files.length} PDF file(s). Extracting text...\n`);

  for (const file of files) {
    const inputPath = path.join(RAW_DATA_DIR, file);
    const outputFile = file.replace('.pdf', '.txt');
    const outputPath = path.join(RAW_DATA_DIR, outputFile);

    try {
      const text = await extractPdf(inputPath);
      fs.writeFileSync(outputPath, text);
      console.log(`Extracted: ${file} -> ${outputFile}`);
    } catch (error) {
      console.error(`Error extracting ${file}:`, error);
    }
  }

  console.log('\nDone! Text files are in data/input/');
}

main();