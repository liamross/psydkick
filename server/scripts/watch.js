var ts = require('typescript');
var nodemon = require('nodemon');

function clearConsole() {
  return process.stdout.write('\033c');
}

var formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function watchMain() {
  clearConsole();
  var configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  var createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  // Note that there is another overload for `createWatchCompilerHost` that
  // takes a set of root files.
  var host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatusChanged,
  );

  // You can technically override any given hook on the host, though you
  // probably don't need to. Note that we're assuming `origCreateProgram` and
  // `origPostProgramCreate` doesn't use `this` at all.
  var origCreateProgram = host.createProgram;
  host.createProgram = (rootNames, options, host, oldProgram) => {
    clearConsole();
    return origCreateProgram(rootNames, options, host, oldProgram);
  };
  var origPostProgramCreate = host.afterProgramCreate;

  host.afterProgramCreate = program => {
    origPostProgramCreate(program);
  };

  // `createWatchProgram` creates an initial program, watches files, and updates
  // the program over time.
  ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic) {
  console.error(
    'Error',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      formatHost.getNewLine(),
    ),
  );
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost));
}

// Initialize watch on TypeScript files.
watchMain();

// Run build script
nodemon({script: 'build/index.js'})
  .on('start', function() {
    console.log('Watching server file changes ("rs" to restart)');
  })
  .on('quit', function() {
    console.log('Shutting down server');
    process.exit();
  });
