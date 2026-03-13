const express = require('express');
const { chromium } = require('playwright-core');
const app = express();
app.use(express.json());
const SECRET = process.env.RENDER_SECRET || '';
app.post('/render', async (req, res) => {
  if (SECRET && req.headers['x-secret'] !== SECRET) return res.status(403).json({ error: 'Forbidden' });
  const { url, timeout = 30000, waitFor = 3000 } = req.body;
  if (!url) return res.status(400).json({ error: 'url required' });
  let browser;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout });
    await page.waitForTimeout(waitFor);
    res.send(await page.content());
  } catch (err) { res.status(500).json({ error: err.message }); }
  finally { if (browser) await browser.close(); }
});
app.get('/health', (_, res) => res.json({ ok: true }));
app.listen(3000, () => console.log('Ready on :3000'));
