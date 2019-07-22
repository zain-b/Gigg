var eventsModel = require('../api/events/events.model');
var storiesModel = require('../api/stories/stories.model');

var connections = 0;

module.exports = {
  setup: function (io) {

      io.on('connection', function(socket){
          console.log("A user connected!");
          io.emit('connections', ++connections);

          let getEvents = eventsModel.find()
              .populate('creator', '-password')
              .populate({path: 'stories', populate: {path: 'creator', select: '_id username photo'}})
              .sort('-createdAt')
              .exec();

          let getStories = storiesModel.find()
              .populate('creator', '-password')
              .populate('event', '_id title')
              .sort('-createdAt')
              .exec();

          getEvents.then(events => {
              getStories.then(stories => {
                  let data = {events: events, stories: stories};
                  socket.emit('complete-data', data);
              })
          });

          socket.on('disconnect', function(){
              console.log('User disconnected.');
              io.emit('connections', --connections);
          });
      });
  },
};