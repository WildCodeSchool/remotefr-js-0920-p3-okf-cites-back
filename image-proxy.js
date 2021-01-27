const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const { sha256, readFileOrCreate } = require('./utils');

const cacheDir = path.join(__dirname, '/.image-cache/');

if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

async function getImage(url) {
  const filename = `${sha256(url)}.jpeg`;
  const filepath = path.join(cacheDir, filename);

  return readFileOrCreate(filepath, async () => {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(res.data);

    return sharp(imageBuffer)
      .resize(300, 250, { position: 'top' })
      .toFormat('jpeg')
      .toBuffer();
  });
}

module.exports = {
  getImage,
};
