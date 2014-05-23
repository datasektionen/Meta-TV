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
			Session.set("type", "external img")
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

Template.slides.internal = function() {
	return Session.get("type") == "local img"
}

Template.slides.events({
	"change .type": function() {
		Session.set("type", $(".type").val())
	},
	"click .send": function() {
		var obj = {
			type: $(".type").val(),
			createdBy: Meteor.user().emails[0].address
		}
		var date = new Date(Date.parse($(".expire").val()))
		if(date != "Invalid Date") {
			obj.expire = date
		}
		if(obj.type == "external img") {
			obj.link = $(".link").val()
			slideshow.insert(obj)
			$(".link").val("")
		} else {
			var file = $(".file")[0].files[0]
			var reader = new FileReader()
			reader.onload = function(event) {
				Meteor.call("file-upload", file, reader.result)
				obj.link = "/uploaded/" + file.name
				if(file.type.split("/")[0] == "image") {
					slideshow.insert(obj)
					$(".file").val("")
				}
			}
			reader.readAsBinaryString(file)
		}
		$(".expire").val("")
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