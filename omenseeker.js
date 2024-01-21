import { Command } from 'commander';
import MapTester from './mapTester.js';
import bar from 'terminal-bar';
import chalk from 'chalk';

const program = new Command();

program
  .command('run <map>')
  .option('-d, --debug', 'output extra debugging')
  .option('-r, --runs <runs>', 'number of runs to perform')
  .option('-a, --advantage', 'roll with advantage for already visited pages')
  .description('test a map')
  .action(async (source, options) => {
    await testMap(source, options.runs, options.debug, options.advantage);
  });

console.log('let\'s gooo');

const testMap = async (source, runs, debug, advantage) => {
  const mapData = await import(`./maps/${source}.json`, {
    assert: { type: "json" },
  });
  const map = mapData.default;
  runs = runs || 1;
  console.log('testing map...');
  let runSuccessCount = 0;
  let runPageCountSum = 0;
  let runPageCountMax = 0;
  const runStats = [];
  for (let i = 0; i < runs; i++) {
    const mapTester = new MapTester(map, debug, advantage);
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
  console.log('\n');
  console.log(`success rate: ${runSuccessCount/runs * 100}% (${runSuccessCount}/${runs})`);
  console.log(`average length: ${runPageCountSum/runs} rounds, max length: ${runPageCountMax} rounds`);
  console.log('\n');

  // bar chart
  const OK_LENGTH_THRESHOLD = 6;
  const chartData = {};
  for (let i = 0; i < runStats.length; i++) {
    chartData[runStats[i].pageCount] = chartData[runStats[i].pageCount] ? chartData[runStats[i].pageCount] + 1 : 1;
  }
  const barData = [];
  for (let i = 0; i < runPageCountMax + 1; i++) {
    barData[i] = chartData[i] || 0;
  }

  console.log(bar(barData, {
    height: Math.max(...Object.values(chartData)),
    width: runPageCountMax * 3,
    color: true,
    icon: '*'
  }));
  console.log('-------------------------------------------------------------');
  console.log(chalk.green('   1  2  3  4  5  6 ') + chalk.red(' 7  8  9 10 11 12 13 14 15 16 17 18 19 20'));
  const labelData = barData.map((value, index) => {
    if (value > 0 && value < 10) {
      return '  ' + value;
    } else if (value >= 10) {
      return ' ' + value; 
    } else {
      return '   ';
    }
  });
  console.log(chalk.yellow(labelData.join('').substring(2)));
  console.log('\n');
}

program.parse();
