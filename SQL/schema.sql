/*CREATE DATABASE chat;*/

USE chat;

CREATE TABLE messages (
  /* Describe your table here.*/
  messageId int,
  username varchar(20),
  time timestamp,
  room varchar(20),
  text text
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




