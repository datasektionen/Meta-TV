slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")

tagmode = new Meteor.Collection("tagmode")
Meteor.subscribe("tagmode")

syncStream = new Meteor.Stream('sync');

var cursor = []

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


syncStream.on('tick', function(message) {
	Session.set("current", message)
});
