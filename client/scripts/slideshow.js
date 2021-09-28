slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")

tagmode = new Meteor.Collection("tagmode")
Meteor.subscribe("tagmode")

syncStream = new Meteor.Stream('sync');

var current;

Template.slideshow.helpers({
	current: function() {
		return Session.get("current")
	}
})

Template.slideshow.events({
	"click .slides-wrapper": function (event) {
		syncStream.emit("flip", "")
	}
})

Template.slideshow.onCreated(function () {
	$(document).on('keydown', function (event) {
		if (event.key == " ") {
			syncStream.emit("flip", "");
		}
	});
});

function _change(newId) {
	current = $("[data-id=" + newId + "]")
	current.show()

	try {
		var v = $("video", current).get(0)
		v.load()
		setTimeout(function() {
			v.play()
		}, 400);

	} catch(e) {}
}

function update(newId) {
	if (current) {

		// Do not reload self
		if (current.data("id") == newId) {
			/* If there is only one slide then we
			 * want this check so that we do not
			 * needlessly flash the screen */
			return;
		}

		current.hide()
		try {
			var v = $("video", current).get(0)
			v.pause()
		} catch(e) {}
	}

	if (!newId || newId == "") {
		// This screen should be blank
		current = null
		return
	}

	return _change(newId)
}

window.update = update

syncStream.on('tick', function(message) {

	var syncedTime = Tracker.nonreactive(TimeSync.serverTime);
	var timeToSwitch = message.switchtime - syncedTime
	//timeToSwitch -= Tracker.nonreactive(TimeSync.roundTripTime) / 2;

	if (timeToSwitch > 5.5 * 1000) {
		// Shit's bonkers
		timeToSwitch = 11 // ms
	}

	setTimeout(function() {
		update(message[_screen])
	}, timeToSwitch);
});
