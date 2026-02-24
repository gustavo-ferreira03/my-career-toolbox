import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const LATEX_DIR = path.join(process.cwd(), 'data', 'output', 'latex');

function checkLatexInstalled(): boolean {
  try {
    execSync('pdflatex --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function cleanAuxFiles(baseName: string, outputDir: string): void {
  const extensions = ['.log', '.aux', '.out', '.fls', '.fdb_latexmk', '.synctex.gz', '.json', '.toc'];
  
  for (const ext of extensions) {
    const filePath = path.join(outputDir, `${baseName}${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

function compileLatex(inputFile: string): boolean {
  const inputPath = path.join(LATEX_DIR, inputFile);
  const baseName = inputFile.replace('.tex', '');
  const outputPdf = path.join(LATEX_DIR, `${baseName}.pdf`);

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    return false;
  }

  try {
    console.log(`Compiling ${inputFile}...`);
    
    execSync(`pdflatex -interaction=nonstopmode -output-directory ${LATEX_DIR} ${inputPath}`, {
      cwd: LATEX_DIR,
      stdio: 'inherit'
    });

    if (fs.existsSync(outputPdf)) {
      cleanAuxFiles(baseName, LATEX_DIR);
      console.log(`\nSuccess! PDF generated: ${outputPdf}`);
      return true;
    } else {
      console.error(`\nError: PDF was not generated.`);
      return false;
    }
  } catch (error) {
    if (fs.existsSync(outputPdf)) {
      cleanAuxFiles(baseName, LATEX_DIR);
      console.log(`\nSuccess! PDF generated (with warnings): ${outputPdf}`);
      return true;
    }
    console.error('Error compiling LaTeX:', error);
    return false;
  }
}

function main() {
  const files = fs.readdirSync(LATEX_DIR).filter(f => f.endsWith('.tex'));

  if (files.length === 0) {
    console.log('No .tex files found in data/output/latex/');
    return;
  }

  if (!checkLatexInstalled()) {
    console.log('LaTeX is not installed on this system.');
    console.log('\nTo compile LaTeX to PDF, you have two options:\n');
    console.log('Option 1: Install LaTeX locally');
    console.log('  - Ubuntu/Debian: sudo apt-get install texlive-latex-base');
    console.log('  - Mac: brew install mactex');
    console.log('  - Windows: Install TeX Live or MiKTeX\n');
    console.log('Option 2: Use Overleaf (recommended)');
    console.log('  1. Go to https://www.overleaf.com');
    console.log('  2. Upload your .tex file from data/output/latex/');
    console.log('  3. Download the compiled PDF');
    return;
  }

  console.log(`Found ${files.length} LaTeX file(s). Compiling...\n`);
  console.log(`Output will be saved to: ${LATEX_DIR}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const success = compileLatex(file);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main();