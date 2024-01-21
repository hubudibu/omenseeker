export default class MapTester {
  map;
  pageCount = -1;
  successCount = 0;
  failureCount = 0;
  debug = false;
  path = [];
  withAdvantage = true;
  bonus = 3;
  constructor(map, debug, withAdvantage) {
    this.map = map;
    this.debug = debug;
    this.withAdvantage = withAdvantage;
  }
  testMap() {
    console.log('testing map...');
    return this.processPage(this.map.start);
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
    let dice;
    if (this.withAdvantage && this.path.includes(page.id)) {
      this.log('loop detected! roll with advantage...');
      dice = MapTester.roll20Adv() + this.bonus;
    } else {
      dice = MapTester.roll20() + this.bonus;
    }
    this.path.push(page.id);
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
  static roll20Adv = () => {
    return Math.max(MapTester.roll20(), MapTester.roll20());
  }
}
