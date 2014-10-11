exports.Initialize = function(socket){
	socket.IP = socket.request.connection.remoteAddress;
	socket.Address = socket.handshake.address;	
  	return socket;
}
