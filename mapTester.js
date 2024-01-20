class MapTester {
  map;
  pageCount = 0;
  successCount = 0;
  failureCount = 0;
  debug = false;
  runs = 1; // TODO
  constructor(map, runs, debug) {
    this.map = map;
    this.runs = runs;
    this.debug = debug;
  }
  testMap() {
    console.log('testing map...');
    this.processPage(this.map.cover);
  }
  processPage(page) {
    this.log('processing page...');
    this.log(page);
    this.pageCount++;
    if (page.type === 'success') {
      console.log(`success! ${this.pageCount}:${this.successCount}/${this.failureCount}`);
      this.log(`page count: ${this.pageCount}, success count: ${this.successCount}, failure count: ${this.failureCount}`);
      return { state: 'success', pageCount: this.pageCount, successCount: this.successCount, failureCount: this.failureCount };
    }
    if (page.type === 'fail') {
      console.log(`fail! ${this.pageCount}:${this.successCount}/${this.failureCount}`);
      this.log(`page count: ${this.pageCount}, success count: ${this.successCount}, failure count: ${this.failureCount}`);
      return { state: 'failure', pageCount: this.pageCount, successCount: this.successCount, failureCount: this.failureCount };
    }
    const dice = MapTester.roll20();
    if (dice >= page.threshold) {
      this.log('success!');
      this.successCount++;
      return this.processPage(this.map[page.paths.success]);
    } else {
      this.log('failure!');
      this.failureCount++;
      return this.processPage(this.map[page.paths.failure]);
    }
  }
  log(message) {
    if (this.debug) {
      console.log(message);
    }
  }
  static roll20 = () => {
    return Math.floor(Math.random() * 20) + 1;
  }
}

module.exports = MapTester;
