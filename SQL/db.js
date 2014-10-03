var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "hrw805",
  password: "hrw805",
  database: "chat"
});

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/




exports.findAllMessages = function(cb){
  var out = {results: []};
  dbConnection.query("SELECT u.username, m.message, m.roomname, m.createdAt, m.messageid from messages m join users u on m.userid = u.userid order by createdAt desc limit 100;", function(err, rows) {
    out.results = rows;
    cb(err, out);
  });
};

exports.findUser = function(username, cb){
  dbConnection.query("SELECT userid as id from users where username = '" + username + "';", function(err, rows) {
    cb(err, rows);
  });
};

exports.saveUser = function(username, cb){
  dbConnection.query("insert into users (username) values ('" + username + "');", function(err, rows){
    if (err) {console.log(err, username);}
    dbConnection.query("select userid as id from users where username = '" + username + "';", function(err, rows){
      cb(rows);
    });
  });
};

exports.saveMessage = function(message, userid, roomname, cb){
  dbConnection.query("insert into messages (message, userid, roomname, createdAt) values ('" + message + "'," + userid + ",'" + roomname + "', UTC_TIMESTAMP());", function(err, rows){
    if (err) {console.log('it errored', err)};
    cb();
  });
};
