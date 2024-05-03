exports.handleError = function(error) {
  console.error(`${chalk.red('[error]')} ${error.message}`);
  console.error(error.stack);
}
