addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event));
});

const TOKEN = process.env.TELEGRAM_TOKEN || "7523993179:AAHl-ETeNDIoAmASem3E1qByAvE3AMpC-0Y";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002588275780";
const URL = "https://www.serv00.com/";
const URL2 = "https://www.ct8.pl/";

async function getNumbers(url, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, { timeout: 15000 });
      const text = await response.text();
      const match = text.match(/<span class="button is-large is-flexible">.*?(\d+)\s*\/\s*(\d+)/);
      if (!match) throw new Error(`無法提取數字，URL: ${url}`);
      return [parseInt(match[1]), parseInt(match[2])];
    } catch (e) {
      if (attempt < retries - 1) await new Promise(r => setTimeout(r, 2000));
      else throw e;
    }
  }
}

async function sendMessage(message) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message })
  });
}

async function handleScheduled() {
  try {
    const [xxxxx, ooooo] = await getNumbers(URL);
    const [xx, oo] = await getNumbers(URL2);
    const difference = ooooo - xxxxx;
    const dif = oo - xx;

    if (difference > 2) {
      await sendMessage(`警告：ooooo - xxxxx = ${difference} > 2\n當前值：${xxxxx} / ${ooooo}`);
    }
    if (dif > 2) {
      await sendMessage(`警告：oo - xx = ${dif} > 2\n當前值：${xx} / ${oo}`);
    }
    if (difference > 2 || dif > 2) {
      await sendMessage(
        `Respority:Davis1233798/monitor.py\n` +
        `github acrtions\n` +
        `網站網址: ${URL}\n` +
        `網站網址: ${URL2}\n` +
        `${URL} 目前可註冊數量: ${difference}\n` +
        `${URL2} 目前可註冊數量: ${dif}`
      );
    }
  } catch (e) {
    await sendMessage(
      `Respority:Davis1233798/monitor.py\n` +
      `github acrtions\n` +
      `監測腳本出現錯誤：${e.message}`
    );
  }
}
