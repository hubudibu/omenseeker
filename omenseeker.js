const Command = require('commander').Command; 
const MapTester = require('./mapTester.js');

const program = new Command();

program
  .command('run <map>')
  .option('-d, --debug', 'output extra debugging')
  .option('-r, --runs <runs>', 'number of runs to perform')
  .description('test a map')
  .action((source, options) => {
    const map = require(`./maps/${source}.json`);
    const runs = options.runs || 1;
    console.log('testing map...');
    let runSuccessCount = 0;
    let runPageCountSum = 0;
    let runPageCountMax = 0;
    for (let i = 0; i < runs; i++) {
      const mapTester = new MapTester(map, options.debug);
      const result = mapTester.testMap();
      if (result.state === 'success') {
        runSuccessCount++;
      }
      runPageCountSum += result.pageCount;
      if (result.pageCount > runPageCountMax) {
        runPageCountMax = result.pageCount;
      }
    }
    console.log(`success rate: ${runSuccessCount/runs * 100}% (${runSuccessCount}/${runs})`);
    console.log(`average page count: ${runPageCountSum/runs}, max page count: ${runPageCountMax}`);
  });

console.log('program called');

program.parse();
