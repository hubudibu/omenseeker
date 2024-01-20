const Command = require('commander').Command; 
const MapTester = require('./mapTester.js');
const Ervy = require('ervy');
const scatter = Ervy.scatter;
const fg = Ervy.fg;

const program = new Command();

program
  .command('run <map>')
  .option('-d, --debug', 'output extra debugging')
  .option('-r, --runs <runs>', 'number of runs to perform')
  .description('test a map')
  .action((source, options) => {
    testMap(source, options.runs, options.debug);
  });

console.log('let\'s gooo');

const testMap = (source, runs, debug) => {
  const map = require(`./maps/${source}.json`);
  runs = runs || 1;
  console.log('testing map...');
  let runSuccessCount = 0;
  let runPageCountSum = 0;
  let runPageCountMax = 0;
  const runStats = [];
  for (let i = 0; i < runs; i++) {
    const mapTester = new MapTester(map, debug);
    const result = mapTester.testMap();
    if (result.state === 'success') {
      runSuccessCount++;
    }
    runPageCountSum += result.pageCount;
    if (result.pageCount > runPageCountMax) {
      runPageCountMax = result.pageCount;
    }
    runStats.push(result);
  }
  console.log(`success rate: ${runSuccessCount/runs * 100}% (${runSuccessCount}/${runs})`);
  console.log(`average length: ${runPageCountSum/runs} rounds, max length: ${runPageCountMax} rounds`);
  
  // Ervy chart
  const OK_LENGTH_THRESHOLD = 6;
  const chartData = {};
  for (let i = 0; i < runStats.length; i++) {
    chartData[runStats[i].pageCount] = chartData[runStats[i].pageCount] ? chartData[runStats[i].pageCount] + 1 : 1;
  }
  const scatterData = [];
  for (const key in chartData) {
    const length = parseInt(key, 10);
    const count = chartData[key];
    scatterData.push({
      key: 'A',
      value: [length, count],
      style: fg(length > OK_LENGTH_THRESHOLD ? 'red' : 'green', count >= 10 ? '*' : count)
    });
  }

  console.log(scatter(scatterData, { 
    legendGap: 10,
    vGap: 3,
    zero: '+',
    height: Math.max(...Object.values(chartData)) + 2,
    width: runPageCountMax + 1,
    hName: 'game length (rounds)',
    vName: '# / ' + runs + ' runs',
  }) + '\n')
}

program.parse();
