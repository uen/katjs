KatJS
=====

A lightweight NodeJS Library. 


Usage
=====

Put the katjs folder in your node_modules folder and add initialize it in your project.

```js
var KAT = require('katjs');
KAT.Init();
```

A typical set-up might look something like this

```
var KAT = require('katjs');

KAT.DB.Connect('host','username','password','database');

// Query a single value
KAT.DB.QueryValue("SELECT count(*) FROM users");

// Query a single row
KAT.DB.QueryRow("SELECT id,name FROM users WHERE id = ?", [1]);

//Query a whole table
KAT.DB.Query("SELECT id FROM users WHERE name = ?, shoesize = ?",['Manolis', 11]);


//Create a reporter to report errors
KAT.SetConfig('reporter', function(error){
  // Do Something
});




```

