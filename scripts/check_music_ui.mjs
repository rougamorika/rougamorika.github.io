import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const outDir = 'D:/Blog/.tmp-check';
fs.mkdirSync(outDir, { recursive: true });

const consoleMessages = [];
const pageErrors = [];
const failedRequests = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });

page.on('console', (msg) => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (err) => pageErrors.push(String(err)));
page.on('response', (response) => {
  if (response.status() >= 400) {
    failedRequests.push(`${response.status()} ${response.url()}`);
  }
});

await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(outDir, 'home.png'), fullPage: true });

const info = {
  title: await page.title(),
  nowPlayingVisible: (await page.getByText('Now Playing').count()) > 0,
  volumeVisible: (await page.getByText('Volume').count()) > 0,
  audioMentions: consoleMessages.filter((msg) => msg.includes('/audio/') || msg.includes('/BGM/')),
  failedRequests,
  pageErrors,
};

console.log(JSON.stringify(info, null, 2));

await browser.close();
