const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching puppeteer with channel: chrome...");
    const browser = await puppeteer.launch({
      headless: "new",
      channel: 'chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    console.log("Puppeteer launched successfully with chrome.");
    await browser.close();
  } catch (e) {
    console.error("Puppeteer launch failed with chrome:", e);
    
    // Fallback to Edge on Windows
    try {
      console.log("Trying with Edge...");
      const browser2 = await puppeteer.launch({
        headless: "new",
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      console.log("Puppeteer launched successfully with Edge.");
      await browser2.close();
    } catch (e2) {
      console.error("Puppeteer launch failed with Edge:", e2);
    }
  }
})();
