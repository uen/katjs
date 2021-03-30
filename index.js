/*
	Cheats:
	
	.Connect(host, username, password, database, callback) // Connects to a Database 

	Query a single value:
	.queryValue("SELECT count(*) FROM users") // Returns a single value
	
	Query a single row:
	.queryRow("SELECT id,name,shoesize FROM users WHERE id = :id", {id:1}); // Returns a single row.

	Query a table:
	.query("SELECT id,name,shoesize FROM users WHERE id = :id", {id:1}); // Returns multiple rows.

	Inserting:
	.Insert('users', [{'name'=>'manolis','shoesize'=>11}, {'name'=>'James', 'shoesize'=>4}]); // Self explanatory.
*/

function reset(arr) {
	if(!arr) return null;
	return (arr[Object.keys(arr)[0]]) ? (arr[Object.keys(arr)[0]]) : null;
}


try{
	var mysql = require('mysql');
} catch(e){
	console.error("MySQL could not be included.");
	console.error(e.message);
	console.error(e.code)
}

var connection;

exports.mysqlInstance = mysql;
exports.q = mysql.query;

exports.connect = function(ip,username,password,database, cb) {
		if(
			ip === undefined ||
			username === undefined ||
			password === undefined ||
			database === undefined
		) {
			console.log(ip, username, password, database)
			throw "Connection details not provided";
		}
	
		let parts = ip.split(':');
		
		const host = parts[0]
		const port = parts.length > 1 ? parts[1] : 3306;

		connection = mysql.createConnection({
			host: host,
			user:username,
			password:password,
			database:database,
			...(port ? {port} : {}),
			charset : 'utf8mb4',
		});



		connection.connect(function(error){
			if(error)
				throw `Error connecting to IP ${ip}. ${error.stack}`;

			connection.on("error", function (err) {
				if (!err.fatal)
					return;

				if (err.code !== "PROTOCOL_CONNECTION_LOST")
					throw err;

				connection.connect(function(error){});
			});

			process.on('exit', function() {
				if(connection){
					connection.end();
				}
			});


			if(cb) cb(connection);
		
	});

	return connection;

};

var queryInternal = (str, array, callback, failure) => {

	var curTime = (new Date).getTime();
	var data = [], match;

	var r = /(:[a-zA-Z]*)/g;
	while(match = r.exec(str)) {
		r.lastIndex = 0;
		var param = match[0]; // :key
		var val   = array[param.slice(1)];
		
		if (val === null) {
			str = str.substring(0, match.index) + 'NULL' + str.substring(match.index + param.length, str.length);
			continue;
		}
		
		str = str.substring(0, match.index) + '?' + str.substring(match.index + param.length, str.length);
		// console.log("setting %j to %j", param, val)
		
		if (typeof val !== "undefined")
			data.push(val);
		else {
			console.error('KatJS: Could not bind param ' + param + ":" + val)
		}
	}
	
    var query = connection.query(str, data, function(err,result){
		if(err) {
			
			console.error('MySQL Error. Query: '+ query.sql +'\r\nError: '+err);
			
			if(failure) failure( query.sql, err);
		}
		else{
			if(callback){
				result = Object.keys(result).length === 0 ? false : result;
				callback(result);
			}
		}
	});
};


exports.query = function(str, array){
	// console.log('[DEBUG KatJS::] New Query: ' + str)

	return new Promise( (resolve, reject) => {
		queryInternal(str,array, (data) => {
			return resolve(data);
		}, (err) => {
			return reject(err);
		});
	});

};

exports.queryRow = function(str,array,callback,failure){
	return new Promise((resolve, reject) => {
		queryInternal(str, array, data => {
			return resolve(reset(data))
		});
	})
};

exports.queryValue = function(str,array){
	return new Promise((resolve, reject) => {
		exports.queryRow(str, array).then((data) => {return resolve(reset(data))});
	})
};

exports.insert = function(table,array,callback, failure, insert){
	insert = typeof insert !== 'undefined' ? insert : 'INSERT';
	var keys = [];
	var values = [];

	for(i in array){
		values.push(':'+i);
		keys.push(i);
	}

	var str = insert+" INTO "+table+" ("+keys.join(',')+") VALUES ("+values.join(',')+")";

	return new Promise( (resolve, reject ) => {
		exports.query(str, array).then(data => {
			return resolve(data.insertId)
		})
	});
};

exports.replace = function(table,array, callback){
	return new Promise((resolve, reject)=>{
		exports.insert(table,array,"REPLACE").then((data)=>
			resolve(data));	
	})
};
