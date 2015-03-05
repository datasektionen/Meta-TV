var send_external_img = function(obj, report){
	testImage($(".link").val(), function(url, result){
		if(result=="success"){
			obj.link = url
			slideshow.insert(obj)
			$(".link").val("")
			report(true)
		}else if (result=="error"){
			var _id = Session.set("link_input_error", "(╯°Д°)╯ This is not an URL to a supported image format!!!")
			report(false, _id)
		}else if (result=="timeout"){
			var _id = Session.set("internal_filetype_error", "ʕ๑◞◟๑ʔ Time out?!!")
			report(false, _id)
		}
	})
}

Template.uploader.helpers({
	isYoutube: function() {
		return Session.get("type") == "youtube"
	},
	isMarkdown: function() {
		return Session.get("type") == "markdown"
	},
	isHTML: function(){
		return Session.get("type") == "html"
	},
	isWebsite: function() {
		return Session.get("type") == "website"
	},
	isVideo: function() {
		return Session.get("type") == "video"
	},
	internal_filetype_error: function() {
		return Session.get("internal_filetype_error") || ""
	},
	link_input_error: function() {
		return Session.get("link_input_error") || ""
	},
	internal: function() {
		return Session.get("type") == "local img"
	}
})

Template.slide.helpers({
	canhazedit: function() {
		return Session.get("hazEdit") == this._id
	}
})

Template.uploader.events({
	"change .type": function() {
		Session.set("type", $(".type").val())
	},
	"click .send": function() {
		Session.set("internal_filetype_error", null)
		Session.set("link_input_error", null)

		var obj = {
			type: $(".type").val(),
			tags:$(".tags").val().split(" "),
			createdBy: Meteor.user().username,
			onlywhenfiltering: $(".hashtagonlyfilter").is(":checked"),
			channel: $(".channel").val()
		}
		var date = new Date(Date.parse($(".expire").val()))

		if(date != "Invalid Date") {
			obj.expire = date
		}

		var report = function(success, identifier){
			if(success){
				var obj_cp = {_id: identifier}
				shallow_copy(obj_cp, obj)
				history_log.insert({
					action: "Added slide",
					by: obj_cp.createdBy,
					time: Date.now(),
					obj: obj_cp,
					tags: obj_cp.tags
				})
			}
		}
		switch (obj.type) {
			case "external img":
				send_external_img(obj, report)
				break
			case "local img":
				send_local_img(obj, report)
				break
			case "video":
			case "youtube":
				// TODO: add video id validation, and error handling
				obj.link=$(".link").val()
				var _id = slideshow.insert(obj)
				$(".link").val("")
				report(true, _id)
				break
			case "markdown":
				obj.body=$(".markdown").val()
				obj.link=$(".link").val()
				var _id = slideshow.insert(obj)
				report(true, _id)
				break
			case "html":
				obj.body=$(".html").val()
				var _id = slideshow.insert(obj)
				report(true, _id)
				break
			case "website":
				obj.link=$(".link").val()
				var _id = slideshow.insert(obj)
				report(true, _id)
			break
		}
	}
})

var send_local_img = function(obj, report){
	var file = $(".file")[0].files[0]
	var reader = new FileReader()

	var alkfrittalternativ = confirm("Lade du upp en bild med \"reklam\" för alkohol? Du glömde väl i så fall inte att göra reklam för ett alkfritt alternativ? " + 
		'\n' + '\n' + "Ha en trevlig kväll!")

	if(alkfrittalternativ == false) {
		return
	}

	if(file.type.split("/")[0] != "image") {
		Session.set("link_input_error", "(ಥ~ಥ)This file type is not suported!")
		return
	}

	reader.onload = function(event) {
		var sc_file = {
			name: file.name + (new Date).getTime(),
			path: file.path,
			type: file.type,
			size: file.size
		}
		Meteor.call("file-upload", sc_file, reader.result, function(a) {
			testImage("/uploaded/" + sc_file.name, function(url, result){
				if(result == "success"){
					obj.link = url
					var _id = slideshow.insert(obj)
					$(".file").val("")
					report(true, _id)
				} else {
					Session.set("internal_filetype_error", "Do not want!!")
				}
			})
		})
	}
	reader.onerror = function(e) {
		Session.set("internal_filetype_error", "You file error!" + e)
	}
	reader.readAsBinaryString(file)
}

function testImage(url, callback, timeout) {
		timeout = timeout || 5000
		var timedOut = false, timer
		var img = new Image()
		img.onerror = img.onabort = function() {
			if (!timedOut) {
				clearTimeout(timer)
				callback(url, "error")
			}
		}
		img.onload = function() {
			if (!timedOut) {
				clearTimeout(timer)
				callback(url, "success")
			}
		}
		img.src = url
		timer = setTimeout(function() {
				timedOut = true
				callback(url, "timeout")
		}, timeout)
}