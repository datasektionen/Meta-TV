slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")

tagmode = new Meteor.Collection("tagmode")
Meteor.subscribe("tagmode")

var cursor = []

var timeout = 30 // s

Template.slideshow.helpers({
	current: function() {
		return Session.get("current")
	}
})

function update() {
	if(cursor.length === 0) {
		var tags = []
		var tagsobjs = tagmode.find({}).fetch()
		tagsobjs.forEach(function(tag) {
			tags.push(tag.tag)
		})
		console.log(tags)
		if(tags.length != 0) {
			console.log("haztags")
			cursor = slideshow.find({tags:{$in:tags}}).fetch()
		} else {
			console.log("notagz")
			cursor = slideshow.find({
				onlywhenfiltering: {
					$ne: true
				}
			}).fetch()
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