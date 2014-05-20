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

Template.slideshow.events({
	"click .fullscreen": function() {
		var elm = $(".content")[0]
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	}
})

Template.slides.events({
	"click .send": function() {
		var obj = {
			type: $(".type").val(),
			link: $(".link").val(),
			createdBy: Meteor.user().emails[0].address
		}
		var date = new Date(Date.parse($(".expire").val()))
		if(date != "Invalid Date") {
			obj.expire = date
		}
		if(obj.link) {
			slideshow.insert(obj)
			$(".link").val("")
			$(".expire").val("")
		}
	}
})

Template.slide.events({
	"click .remove": function() {
		slideshow.remove({_id: this._id})
	}
})

function update() {
	if(cursor.length === 0) {
		cursor = slideshow.find().fetch()
	}
	Session.set("current", cursor.pop())
}
setInterval(update, timeout * 1000)