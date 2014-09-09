exports.Initialize = function(socket){
  socket.kat = true;
  socket.IP = socket.request.connection.remoteAddress  
  return socket;
}
