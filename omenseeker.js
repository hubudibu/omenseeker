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
    const mapTester = new MapTester(map, options.runs, options.debug);
    mapTester.testMap();
  });

console.log('program called');

program.parse();
