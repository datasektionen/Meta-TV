var send_external_img = function(obj, slide){
	obj.link = $(".link").val()
	Meteor.call("insertSlide", slide, obj)
	$(".link").val("")
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
			_id: new Mongo.ObjectID().toHexString(),
			type: $(".type").val(),
			createdBy: Meteor.user().username,
			"screen": $(".channel").val()
		}

		var slide = $(".parentSlide").val();

		switch (obj.type) {
			case "external img":
				send_external_img(obj, slide)
				break
			case "local img":
				send_local_img(obj, slide)
				break
			case "video":
			case "youtube":
				// TODO: add video id validation, and error handling
				obj.link=$(".link").val()
				var _id = Meteor.call("insertSlide", slide, obj)
				$(".link").val("")
				break
			case "markdown":
				obj.body=$(".markdown").val()
				obj.link=$(".link").val()
				var _id = Meteor.call("insertSlide", slide, obj)
				break
			case "html":
				obj.body=$(".html").val()
				var _id = Meteor.call("insertSlide", slide, obj)
				break
			case "website":
				obj.link=$(".link").val()
				var _id = Meteor.call("insertSlide", slide, obj)
			break
		}
	}
})

var send_local_img = function(obj, slide){
	var file = $(".file")[0].files[0]
	var reader = new FileReader()

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
			obj.link = "/uploaded/" + sc_file.name
			var _id = Meteor.call("insertSlide", slide, obj)
			$(".file").val("")
		})
	}
	reader.onerror = function(e) {
		Session.set("internal_filetype_error", "You file error!" + e)
	}
	reader.readAsBinaryString(file)
}