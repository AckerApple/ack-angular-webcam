const browserIndex = process.argv.indexOf('--browser')
const browserArg = browserIndex>=0 ? process.argv[browserIndex+1] : ''

const setup = {
  //basePath: '',
  basePath: 'src',
  frameworks: [
    'jasmine',
    //'karma-typescript',
    '@angular/cli'
  ],

//preprocessors: {
//  "**/*.ts": ["karma-typescript"] // *.tsx for React Jsx 
//},

  plugins: [
    require('karma-jasmine'),
    require('karma-chrome-launcher')
    //,require('karma-typescript')
    //,require('karma-remap-istanbul')
  ],
  browsers: [], /* add PhatomJS here */
  //singleRun: false,
  browserDisconnectTolerance : 2,
  browserNoActivityTimeout : 20000,
  browserDisconnectTimeout : 5000,
  reporters: ['progress'],//['progress','karma-typescript'],//['dots', 'karma-remap-istanbul'],//['progress'],//'dots',
  mime: { 'text/x-typescript': ['ts','tsx'] },
  client: { captureConsole: true }
}

//setup.preprocessors = {
//  '**/*.spec.ts': ['@angular/cli']
//}

//setup.files = [
//  {pattern: '**/*.spec.ts', included: true}
//]

/*
setup.preprocessors = {
  './test/test.ts': ['@angular/cli']
}
setup.files = [
  {pattern: './test/test.ts', watched: false}
]
*/
//setup.files = [{pattern: '**/*.spec.ts', included: true}]
//setup.files = ['src/index']
//setup.files = ['src/**/*.spec.ts']
/*setup.angularCli = {
  config: './angular-cli.json',
  environment: 'dev'
}*/

if( browserArg=='PhantomJS' ){
  setup.browsers.push('Chrome')
  setup.browsers.push('PhantomJS')
  setup.plugins.push( require('karma-phantomjs-launcher') )
  setup.plugins.push( require('karma-jasmine-html-reporter') )
  setup.plugins.push( require('karma-coverage-istanbul-reporter') )
}else{
  setup.browsers.push('Chrome')
  setup.customLaunchers = require('./test/sauce-browsers').customLaunchers()
}

setup.plugins.push( require('@angular/cli/plugins/karma') )

module.exports = function (config) {
  setup.logLevel = config.LOG_INFO
  config.set(setup);
};
