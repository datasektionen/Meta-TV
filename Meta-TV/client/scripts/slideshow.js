slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")

var cursor = []

var timeout = 30 // s

Template.slideshow.current = function() {
	return Session.get("current")
}

function update(tag) {
	if(cursor.length === 0) {
		if(tag) {
			console.log("haztags")
			cursor = slideshow.find({tags:{$in:tag}}).fetch()
		} else {
			console.log("notagz")
			cursor = slideshow.find().fetch()
		}
	}
	Session.set("current", cursor.pop())
}
window.update = update
setInterval(update, timeout * 1000)


Template.slideshow.events({
	"click .fullscreen": function() {
		var elm = $(".content")[0]
		console.log(elm)
		if (elm.requestFullscreen) {
			elm.requestFullscreen();
		} else if (elm.msRequestFullscreen) {
			elm.msRequestFullscreen();
		} else if (elm.mozRequestFullScreen) {
			elm.mozRequestFullScreen();
		} else if (elm.webkitRequestFullscreen) {
			elm.webkitRequestFullscreen();
		}
	}
})