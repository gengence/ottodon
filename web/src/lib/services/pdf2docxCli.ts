import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { execFile } from 'child_process';

function exec(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function pdfToDocxCLI(pdf: Buffer): Promise<Buffer> {
  const uid = randomUUID();
  const base = join(tmpdir(), `pdf2docx_${uid}`);
  const pdfPath = `${base}.pdf`;
  const docxPath = `${base}.docx`;

  await fs.writeFile(pdfPath, pdf);

  try {
    await exec('pdf2docx', ['convert', pdfPath, docxPath, '--quiet']);
    const data = await fs.readFile(docxPath);
    return data;
  } finally {
    fs.unlink(pdfPath).catch(() => {});
    fs.unlink(docxPath).catch(() => {});
  }
} 