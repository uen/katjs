/*
	Cheats:
	
	.Connect(host, username, password, database) // Connects to a Database. Self explanatory. 

	Query a single value:
	.QueryValue("SELECT count(*) FROM users") // Returns a single value
	
	Query a single row:
	.QueryRow("SELECT id,name,shoesize FROM users WHERE id = ?", ['1']); // Returns a single row.

	Query a table:
	.Query("SELECT id,name,shoesize FROM users WHERE id = ?", ['1']); // Returns multiple rows.

	Inserting:
	.Insert('users', [{'name'=>'manolis','shoesize'=>11}, {'name'=>'James', 'shoesize'=>4}]); // Self explanatory.
*/

function reset(arr) {
	return (arr[Object.keys(arr)[0]]) ? (arr[Object.keys(arr)[0]]) : NULL; 
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

function QueryInternal(str,array, callback){
	var curTime = (new Date).getTime();

	connection.query(str, array, function(err,data){
		if(err){
			console.error('MySQL Error: '+err);
		}
		else{
			if(callback){
				callback(data);
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
	})
}

exports.QueryValue = function(str,array,callback){
	exports.QueryRow(str,array,function(data){
		if(callback){
			callback(reset(data))
		}
	})
}

exports.Insert = function(table,array,callback, insert){
	insert = typeof insert !== 'undefined' ? insert : 'INSERT';
	var keys = [];
	var keys_val = [];
	var values = [];

	for(i in array){
		keys.push(i);
		values.push(array[i]);
		keys_val.push('?');
	}

	var str = insert+" INTO "+table+" ("+keys.join(',')+") VALUES ("+keys_val.join(',')+")";


	exports.Query(str, values, function(data){
		if(callback){
			callback(data.insertId);
		}
	});

}

exports.Replace = function(table,array, callback){
	exports.Insert(table,array,callback,"REPLACE");
}


