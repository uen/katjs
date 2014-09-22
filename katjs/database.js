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

//Todo: Write a new, good reset function
function reset(arr) {
	var val;
	for(var key in arr){
		val = arr[key];
	}
	this.php_js = this.php_js || {};
	this.php_js.pointers = this.php_js.pointers || [];
	var indexOf = function(value) {
		for (var i = 0, length = this.length; i < length; i++) {
			if (this[i] === value) {
				return i;
			}
		}
		return -1;
	};
	var pointers = this.php_js.pointers;
	if (!pointers.indexOf) {
		pointers.indexOf = indexOf;
	}
	if (pointers.indexOf(arr) === -1) {
		pointers.push(arr, 0);
	}
	var arrpos = pointers.indexOf(arr);
	if (Object.prototype.toString.call(arr) !== '[object Array]') {
		for (var k in arr) {
			if (pointers.indexOf(arr) === -1) {
				pointers.push(arr, 0);
			} else {
				pointers[arrpos + 1] = 0;
			}
			return arr[k];
		}
		return false;
	}

	if (arr.length === 0) {
		return false;
	}
	pointers[arrpos + 1] = 0;
	return arr[pointers[arrpos + 1]];
}


try{
	var mysql = require('mysql');
} catch(e){
	console.error("MySQL could not be included.");
	console.error(e.message);
	console.error(e.code)
}
var queries = 0;
var connection;
exports.Connect = function(ip,username,password,database){
	connection = mysql.createConnection({
		host:ip,
		user:username,
		password:password,
		database:database
	})

	connection.connect(function(error){
		if(error){
			console.error('Error connecting to IP '+ip+'. Error: '+error.stack);
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

		console.log('Connected to MySQL Database');
	});


}

function QueryInternal(str,array, callback){
	console.log('Starting query: '+str);
	queries++;
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

	for(var i = 0; i<array.length; i++){
		for(var key in array[i]){
			keys.push(key);
			values.push(array[i][key]);
		}
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



