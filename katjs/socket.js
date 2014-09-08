function Socket(socket){
  socket.kat = true;
  socket.IP = function(){
    return socket.request.connection.remoteAddress  
  }
  return socket;
}
