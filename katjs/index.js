exports.cfg = {
  reporter:null
}

exports.Config = function(k,v){
  exports.cfg[k] = v;
}

exports.DB = require('./database');
exports.SOCKET = require('./socket');
