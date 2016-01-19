/*
	Cheats:
	
	.Connect(host, username, password, database) // Connects to a Database. Self explanatory. 

	Query a single value:
	.QueryValue("SELECT count(*) FROM users") // Returns a single value
	
	Query a single row:
	.QueryRow("SELECT id,name,shoesize FROM users WHERE id = :id", {id:1}); // Returns a single row.

	Query a table:
	.Query("SELECT id,name,shoesize FROM users WHERE id = :id", {id:1}); // Returns multiple rows.

	Inserting:
	.Insert('users', [{'name'=>'manolis','shoesize'=>11}, {'name'=>'James', 'shoesize'=>4}]); // Self explanatory.
*/

function reset(arr) {
	if(!arr) return null;
	return (arr[Object.keys(arr)[0]]) ? (arr[Object.keys(arr)[0]]) : null;; 
}

try{
	var mysql = require('mysql');
} catch(e){
	console.error("MySQL could not be included.");
	console.error(e.message);
	console.error(e.code)
}

var connection;
exports.Connect = function(ip,username,password,database, callback){
	if(!(ip)&&(username)&&(password)&&(database)){
		return false;
	}
	connection = mysql.createConnection({
		host:ip,
		user:username,
		password:password,
		database:database
	})

	connection.connect(function(error){
		if(error){
			console.error('DB:: Error connecting to IP '+ip+'. Error: '+error.stack);
			return;
		}

		connection.on("error", function (err) {
			if (!err.fatal) {
				return;
			}

			if (err.code !== "PROTOCOL_CONNECTION_LOST") {
				throw err;
			}

			connection.connect(function(error){
				if(error){
					process.exit(1);
				}
			});

		});

		process.on('exit', function() {
			if(connection){
				connection.end();
			}
		});

		if(callback) callback();
	}); 


}

function QueryInternal(str,array, callback, fail){
	var curTime = (new Date).getTime();
	var data = [], match;

	var r = /(:[a-zA-Z]*)/g;
	while(match = r.exec(str)){
		r.lastIndex = 0;
		var param = match[0];
		str = str.substring(0,match.index) +'?'+str.substring(match.index+param.length, str.length);

		if(array[param.slice(1)]) data.push(array[param.slice(1)]);
		else console.error('KatJS: Could not bind param '+param)
	}

	connection.query(str, data, function(err,result){
		if(err){
			console.error('MySQL Error: '+err);
			fail(err);
		}
		else{
			if(callback){
				callback(result);
			}
		}
	});
}


exports.Query = function(str,array,callback){
	QueryInternal(str,array, function(data){
		if(callback){
			callback(data);
		}
	});
}

exports.QueryRow = function(str,array,callback){
	QueryInternal(str,array,function(data){
		if(callback){
			callback(reset(data))
		}
	});
}

exports.QueryValue = function(str,array,callback){
	exports.QueryRow(str,array,function(data){
		if(callback){
			callback(reset(data))
		}
	});
}

exports.Insert = function(table,array,callback, insert){
	insert = typeof insert !== 'undefined' ? insert : 'INSERT';
	var keys = [];
	var values = [];

	for(i in array){
		values.push(':'+i);
		keys.push(i);
	}



	var str = insert+" INTO "+table+" ("+keys.join(',')+") VALUES ("+values.join(',')+")";

	exports.Query(str, array, function(data){
		if(callback){
			callback(data.insertId);
		}
	});
}

exports.Replace = function(table,array, callback){
	exports.Insert(table,array,callback,"REPLACE");
}



