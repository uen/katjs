exports.cfg = {
  reporter:null
}

exports.SetConfig = function(k,v){
  exports.cfg[k] = v;
}


exports.DB = require('./database');
exports.SOCKET = require('./socket');

