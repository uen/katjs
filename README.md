KatJS
=====

A lightweight NodeJS MySQL wrapper 


Usage
=====

Put the katjs folder in your node_modules folder

```js
var KAT = require('katjs');
```

A typical set-up might look something like this

```
var KAT = require('katjs');

KAT.Connect('host','username','password','database', function(){
    console.log('Successfully connected to database');
});

// Query a single value
KAT.QueryValue("SELECT count(*) FROM users", function(data){
  // Callback here
});

// Query a single row
KAT.QueryRow("SELECT id,name FROM users WHERE id = ?", [1], function(data){
  // Callback here
});

//Query a whole table
KAT.Query("SELECT id FROM users WHERE name = ?, shoesize = ?",['Manolis', 11], function(data){
  // Callback here
});
