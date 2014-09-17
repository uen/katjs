exports.Initialize = function(socket){
  socket.IP = function(){ socket.request.connection.remoteAddress }
  return socket;
}
