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

module.exports = {
  Semaphore,
};
