const crypto = require('crypto');
const fs = require('fs');

// From https://gist.github.com/Gericop/e33be1f201cf242197d9c4d0a1fa7335
class Semaphore {
  constructor(max) {
    let counter = 0;
    let waiting = [];

    const take = function () {
      if (waiting.length > 0 && counter < max) {
        counter++;
        const promise = waiting.shift();
        promise.resolve();
      }
    };

    this.acquire = function () {
      if (counter < max) {
        counter++;
        return new Promise((resolve) => {
          resolve();
        });
      }
      return new Promise((resolve, err) => {
        waiting.push({ resolve, err });
      });
    };

    this.release = function () {
      counter--;
      take();
    };

    this.purge = function () {
      const unresolved = waiting.length;

      for (let i = 0; i < unresolved; i++) {
        waiting[i].err('Task has been purged.');
      }

      counter = 0;
      waiting = [];

      return unresolved;
    };
  }
}

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

async function fileExistsAsync(filepath) {
  try {
    await fs.promises.access(filepath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function readFileOrCreate(filepath, createFunc) {
  try {
    return await fs.promises.readFile(filepath);
  } catch {
    const data = await createFunc();
    await fs.promises.writeFile(filepath, data);

    return data;
  }
}

module.exports = {
  Semaphore,
  sha256,
  getUrlExtension,
  fileExistsAsync,
  readFileOrCreate,
};
