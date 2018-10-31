KatJS
=====

A lightweight NodeJS MySQL wrapper 


Usage
=====

Put the katjs folder in your node_modules folder

```js
var kat = require('katjs');
```

A typical set-up might look something like this

```
var kat = require('katjs');

kat.connect('host','username','password','database', function(){
    console.log('Successfully connected to database');
});

// Query a single value
kat.queryValue("SELECT count(*) FROM users", function(data){
  // Callback here
});

// Query a single row
kat.queryRow("SELECT id,name FROM users WHERE id = :id", {id:1}, function(data){
  // Callback here
});

//Query a whole table
kat.query("SELECT id FROM users WHERE name = :name, shoesize = :size",{name:'Manolis',size:11}, function(data){
  // Callback here
});
