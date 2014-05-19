slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")
var cursor = []

Router.map(function() {
	this.route('slideshow', {
		path: '/',
		data: function() {
			update()
		}
	}),
	this.route('slides', {
		path: '/slides',
		data: function() {
			return {
				slides: slideshow.find({})
			}
		}
	})
})

Template._loginButtonsMessages.infoMessage = "@kth.se mail required"

var timeout = 5 // s

Template.slideshow.current = function() {
	return Session.get("current")
}

function update() {
	if(cursor.length === 0) {
		cursor = slideshow.find().fetch()
	}
	Session.set("current", cursor.pop())
}
setInterval(update, timeout * 1000)