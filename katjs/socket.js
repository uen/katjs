exports.Initialize = function(socket){
	socket.IP = function(){
  		return socket.request.connection.remoteAddress;
	}
  	return socket;
}
