/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Lecture = require('./lecture.model'),
  Poll = require('../poll/poll.model');

var speakerSocket;
exports.register = function(socket) {

  Lecture.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Lecture.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  socket.on('lecture:speakerConnect', function (data) {
      speakerSocket = socket;
  });
  // join a lecture by key => register member in the corresponding lecture room and send info about this lecture
  socket.on('lecture:join', function (key) {

    /**
     * Ici l'utilisateur est ajouté à la room de la session. Le nom de cette room est la clé de la session (ex: XVRF9)
     * Cela permet de distribuer nos socket uniquement à ceux qui sont connectés à cette romm (session)
     *
     * On communique avec eux avec : socket.to(nom de la room).emit(nom de l'évenement, données)
     * Example: socket.to(key).emit(poll:start, poll);
     */
    socket.join(key);

    console.log('[SOCKET] join session: ' + key);
    Lecture.findOne({key: key}, function (err, lecture) {
      if(!err) {
        // find activated polls
        Poll.find({state: 'active', lecture: lecture._id})
          .populate('questions')
          .exec(function (err, polls) {
            if(err) console.log(err);
          console.log(polls);
          socket.emit('lecture:join', {lecture: lecture, polls: polls});
        });
      }
    });
  });
};

function onSave(socket, doc, cb) {
  socket.emit('lecture:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('lecture:remove', doc);
}
