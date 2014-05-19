slideshow = new Meteor.Collection("slideshow")

var cursor = []

Router.map(function() {
	this.route('slideshow', {
		path: '/',
		data: function() {
			update()
		}
	})
})

var timeout = 10 // s

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
