const browserIndex = process.argv.indexOf('--browser')
const browserArg = browserIndex>=0 ? process.argv[browserIndex+1] : ''

const setup = {
  //basePath: '',
  basePath: 'src',
  frameworks: [
    'jasmine',
    //'karma-typescript',
    '@angular-devkit/build-angular'
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
//  '**/*.spec.ts': ['@angular-devkit/build-angular']
//}

//setup.files = [
//  {pattern: '**/*.spec.ts', included: true}
//]

/*
setup.preprocessors = {
  './test/test.ts': ['@angular-devkit/build-angular']
}
setup.files = [
  {pattern: './test/test.ts', watched: false}
]
*/
//setup.files = [{pattern: '**/*.spec.ts', included: true}]
//setup.files = ['src/index']
//setup.files = ['src/**/*.spec.ts']
/*setup.*/

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

setup.plugins.push( require('@angular-devkit/build-angular/plugins/karma') )

module.exports = function (config) {
  setup.logLevel = config.LOG_INFO
  config.set(setup);
};
