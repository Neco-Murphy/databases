
var app = {
  server: 'http://127.0.0.1:3000/classes/messages',
  currentRoom: undefined,
  friendList: [],
  buttons: [],
  url: $(location).attr('href'),

  init: function() {
    app.username = app.url.substring(app.url.indexOf('username') + 9, app.url.length);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function () {
        console.log('chatterbox: Message sent');
        app.addMessage(message);
      },
      error: function () {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      //data: {order : '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        app.displayMessages(data);

        $('li').click(function(){
          var text = $(this).html();
          var friendName = text.substring(text.indexOf('|') + 2, text.indexOf(':') - 1);
          app.friendList.push(friendName);
        });
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  displayMessages: function(data) {
    app.clearMessages();

    for (var i = data.results.length - 1; i >= 0; i--){
      var currentData = data.results[i];
      for (var key in currentData) {
        if(currentData[key] !== null && typeof currentData[key] === 'string') {
          currentData[key] = app.scrubber(currentData[key]);
        }
      }
      app.addMessage(currentData);
    }
    app.addRooms(data);

  },

  addRooms: function(data) {
    $('#roomSelect').empty();
    var rooms = [];

    for (var i = data.results.length - 1; i >= 0; i--){
      var currentData = data.results[i].roomname;
      if (rooms.indexOf(currentData) === -1){
        rooms.push(currentData);
        app.addRoom(currentData);
      }
    }

    $('.room').click(function(){
      app.currentRoom = this.id;
    });
  },

  scrubber: function(data) {
    return data.replace(/[&<>`"'!@$%()=+{}]/g, "");
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(message) {
    if (message.roomname === app.currentRoom || app.currentRoom === undefined){
      if (app.friendList.indexOf(message.username) !== -1){
        $('#chats').prepend('<li><b>' + message.roomname + ' | ' + message.username + ' : ' + message.message + '</b></li>');
      } else {
        $('#chats').prepend('<li>' + message.roomname + ' | ' + message.username + ' : ' + message.message + '</li>');
      }
    }
  },

  addRoom: function(roomname) {
    $('#roomSelect').append('<button class= "room" id= "' + roomname + '">' + roomname + '</button>');
  }
};

////////////// DOC READY //////////////////

$(function() {
  app.init();

  window.setInterval(function() {
    app.fetch();
  }, 1000);

  $('#sendButton').click(function(){
    var sendMessage = {
      username: app.username,
      message: $('#newMessage').val(),
      roomname: app.currentRoom || 'lobby'
    };
    app.send(sendMessage);
  });

  $('#allrooms').click(function(){
    app.currentRoom = undefined;
  });

  $('#createRoom').click(function(){
    app.currentRoom = $('#newRoom').val();
    $('#defaults').append('<button class = "room" id = "' + app.currentRoom + '">' + app.currentRoom + '</button>');
  });
});

