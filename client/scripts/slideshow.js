slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")

tagmode = new Meteor.Collection("tagmode")
Meteor.subscribe("tagmode")

syncStream = new Meteor.Stream('sync');

var cursor = [], counter = 0;
var num_flips_without_refresh = 5;

Template.slideshow.helpers({
	current: function() {
		return Session.get("current")
	}
})


/* On space, flip slide for all listeners */
$( window ).bind("keypress", function(evt) {
	if(evt.keyCode == 32) {
		syncStream.emit("flip", "");
	}
})


function update(newId) {
	if( (counter++) % num_flips_without_refresh == 0) {
		cursor = slideshow.find({}).fetch()
		TimeSync.resync()
	}

	var next;
	if (newId) {
		next = _.where(cursor, {_id: newId})
	} else {
		next = [cursor[counter % cursor.length]] 
	}

	if(next.length == 0) {
		// retry once
		cursor = slideshow.find({}).fetch()
		next = _.where(cursor, {_id: newId})
	}

	Session.set("current", next[0])
}

window.update = update

syncStream.on('tick', function(message) {

	var syncedTime = Tracker.nonreactive(TimeSync.serverTime);
	var timeToSwitch = message[1] - syncedTime
	timeToSwitch -= Tracker.nonreactive(TimeSync.roundTripTime) / 2;

	setTimeout(function() {
		update(message[0])
	}, timeToSwitch);
});
