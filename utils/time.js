exports.generateTime = function(days) {
  return Math.floor(Date.now() / 1000) + 24 * days * 3600;
}
