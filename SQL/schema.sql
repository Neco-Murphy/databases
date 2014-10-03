CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  /* Describe your table here.*/
  messageId int not null auto_increment,
  userid int not null,
  createdAt timestamp,
  roomname varchar(20),
  message text,
  PRIMARY KEY (messageId)
);

/* Create other tables and define schemas for them here! */

CREATE TABLE users (
  userid int not null auto_increment,
  username varchar(20),
  PRIMARY KEY (userid)
);


/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




