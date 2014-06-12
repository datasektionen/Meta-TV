function testImage(url, callback, timeout) {
		timeout = timeout || 5000;
		var timedOut = false, timer;
		var img = new Image();
		img.onerror = img.onabort = function() {
				if (!timedOut) {
						clearTimeout(timer);
						callback(url, "error");
				}
		};
		img.onload = function() {
				if (!timedOut) {
						clearTimeout(timer);
						callback(url, "success");
				}
		};
		img.src = url;
		timer = setTimeout(function() {
				timedOut = true;
				callback(url, "timeout");
		}, timeout);
}

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

var timeout = 30 // s

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

Template.slides.internal_filetype_error=function(){
	return Session.get("internal_filetype_error") || ""
}

Template.slides.link_input_error=function(){
	return Session.get("link_input_error") || ""
}

Template.slides.events({
	"change .type": function() {
		Session.set("type", $(".type").val())
	},
	"click .send": function() {
		Session.set("internal_filetype_error", null)
		Session.set("link_input_error", null)

		var obj = {
			type: $(".type").val(),
			createdBy: Meteor.user().emails[0].address
		}
		var date = new Date(Date.parse($(".expire").val()))

		if(date != "Invalid Date") {
			obj.expire = date
		}

		if(obj.type == "external img") {
			testImage($(".link").val(), function(url, result){
				if(result=="success"){
					obj.link = url
					slideshow.insert(obj)
					$(".link").val("")
					console.log("sucsess")
				}else if (result=="error"){
					Session.set("link_input_error", "(╯°Д°)╯ This is not an URL to a supported image format!!!")
					console.log("not success")
				}else if (result=="timeout"){
					Session.set("internal_filetype_error", "ʕ๑◞◟๑ʔ Time out?!!")
					console.log("time out")
				}
			})
			return
		} else {
			var file = $(".file")[0].files[0]
			var reader = new FileReader()

			if(file.type.split("/")[0] != "image") {
				Session.set("link_input_error", "(ಥ~ಥ)This file type is not suported!")
				return
			}

			reader.onload = function(event) {
				var sc_file = {
					name: file.name,
					path: file.path,
					type: file.type,
					size: file.size
				}
				Meteor.call("file-upload", sc_file, reader.result)
				testImage("/uploaded/" + sc_file.name, function(url, result){
					if(result=="success"){
						obj.link = url
						slideshow.insert(obj)
						$(".file").val("")
					}else{
						Session.set("internal_filetype_error", "Do not want!!")
						// TODO: remove upleaded image from server
					}
				})
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
