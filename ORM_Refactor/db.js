var mysql = require('mysql');
var Sequelize = require('sequelize');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var sequelize = new Sequelize("chat", "root", "");

var User = sequelize.define('User', {
  username: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  userid: Sequelize.INTEGER,
  message: Sequelize.STRING,
  roomname: Sequelize.STRING
});

User.sync()
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table:', err);
    } else {
      console.log('Created the table users!');
    }
  });
Message.sync()
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table:', err);
    } else {
      console.log('Created the table messages!');
    }
  });

User.hasMany(Message, {foreignKey: 'id'});
Message.belongsTo(User, {foreignKey: 'userid'});

exports.findAllMessages = function(cb){
  var out = {results: []};
  Message.findAll({include: [User], order: 'createdAt desc'}).complete(function(err, rows){
    //rows[0] = {
    //  id:
    //  message:
    //  userid:
    //  roomname:
    //  createAt:
    //  modifiedAt:
    //  users.username:
    //  users.id:
    //  users.createdAt:
    //  users.modifiedAt:
    //}
    if (err) { console.log('findAllMessages error', err); }
    if (rows === null) {
      cb(err);
    } else {
      for (var i = 0; i < rows.length; i++){
        rows[i] = {
          messageid: rows[i]['dataValues']['id'],
          username: rows[i]['dataValues']['User']['username'],
          message: rows[i]['dataValues']['message'],
          roomname: rows[i]['dataValues']['roomname'],
          createdAt: rows[i]['dataValues']['createdAt']
        };
      }
      out.results = rows;
      cb(err, out);
    }
  });
  // dbConnection.query("SELECT u.username, m.message, m.roomname, m.createdAt, m.messageid from messages m join users u on m.userid = u.userid order by createdAt desc limit 100;", function(err, rows) {
  // });
};

exports.findUser = function(username, cb){
  User.find({ where: {'username': username}}).complete(function(err, user){
    if (err) { console.log('findUser error', err); }
    if (user === null) {
      cb(err);
    } else {
      cb(err, [user.dataValues]);
    }
  });
  // dbConnection.query("SELECT userid as id from users where username = '" + username + "';", function(err, rows) {
  //   cb(err, rows);
  // });
};

exports.saveUser = function(username, cb){
  User.create({'username': username}).complete(function(err, user){
    if (err) { console.log('saveUser error', err); }
    cb([user.dataValues]);
  });
  // dbConnection.query("insert into users (username) values ('" + username + "');", function(err, rows){
  //   if (err) {console.log(err, username);}
  //   dbConnection.query("select userid as id from users where username = '" + username + "';", function(err, rows){
  //     cb(rows);
  //   });
  // });
};

exports.saveMessage = function(message, userid, roomname, cb){
  Message.create({'message': message, 'userid': userid, 'roomname': roomname}).complete(function(err, message){
    if (err) { console.log('saveMessage error', err); }
    cb();
  });
  // dbConnection.query("insert into messages (message, userid, roomname, createdAt) values ('" + message + "'," + userid + ",'" + roomname + "', UTC_TIMESTAMP());", function(err, rows){
  //   cb();
  // });
};
