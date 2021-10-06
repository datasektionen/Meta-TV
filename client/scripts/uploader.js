var send_external_img = function(obj, slide, id){
	obj.link = $("." + id + "link").val();
	Meteor.call("insertSlide", slide, obj);
	$("." + id + "link").val("");
};

function getLoginUrl() {
	callback = location.protocol + "//" + location.hostname;
	if(location.port) {
		callback += ":" + location.port;
	}
	callback += "/login/";
	return "https://login.datasektionen.se/login?callback=" + callback;
}

Template.uploader.helpers({
	isYoutube: function() {
		return Session.get(this._id + "type") == "youtube";
	},
	isMarkdown: function() {
		return Session.get(this._id + "type") == "markdown";
	},
	isHTML: function(){
		return Session.get(this._id + "type") == "html";
	},
	isWebsite: function() {
		return Session.get(this._id + "type") == "website";
	},
	isVideo: function() {
		return Session.get(this._id + "type") == "video";
	},
	internal_filetype_error: function() {
		return Session.get("internal_filetype_error") || "";
	},
	link_input_error: function() {
		return Session.get("link_input_error") || "";
	},
	internal: function() {
		return Session.get(this._id + "type") == "local img";
	},
	uploading: function() {
		return Session.get("is_loading") && Session.get("type") == "local img";
	},
	loginurl: getLoginUrl,
});

Template.slide.helpers({
	canhazedit: function() {
		return Session.get("hazEdit") == this._id;
	}
});

Template.addslides.helpers({
	loginurl: getLoginUrl
});

Template.filters.helpers({
	loginurl: getLoginUrl
});

Template.uploader.events({
	"change .type_group.initialized": function() {
		Session.set(this._id + "type", $("." + this._id + "type.initialized").val());
	},
	"click .send": function() {
		Session.set("internal_filetype_error", null);
		Session.set("link_input_error", null);

		var obj = {
			_id: new Mongo.ObjectID().toHexString(),
			type: $("." + this._id + "type.initialized").val(),
			createdBy: Meteor.user().username,
			parentid: this._id,
			name: this.name,
			"screen": $("." + this._id + "channel.initialized").val()
		};

		//History event for creating a page.
		var obj_cp = {};
		shallow_copy(obj_cp, obj);
		history_log.insert({
			action:"Added page",
			by:Meteor.user().username,
			time:Date.now(),
			obj:obj_cp,
		});

		var slide = this._id;//$(".parentSlide").val();

		switch (obj.type) {
			case "external img":
				send_external_img(obj, slide, this._id);
				break;
			case "local img":
				send_local_img(obj, slide);
				break;
			case "video":
			case "youtube":
				// TODO: add video id validation, and error handling
				obj.link=$("." + this._id + "link").val();
				var _id = Meteor.call("insertSlide", slide, obj);
				$("." + this._id + "link").val("");
				break
			case "markdown":
				obj.body=$("." + this._id + "markdown").val();
				obj.link=$("." + this._id + "link").val();
				var _id = Meteor.call("insertSlide", slide, obj);
				break;
			case "html":
				obj.body=$("." + this._id + "html").val();
				var _id = Meteor.call("insertSlide", slide, obj);
				break
			case "website":
				obj.link=$("." + this._id + "link").val()
				var _id = Meteor.call("insertSlide", slide, obj)
			break
		}
	}
})

var send_local_img = function(obj, slide){
	var file = $("."+ slide + "file")[0].files[0]
	var reader = new FileReader()

	if(file.type.split("/")[0] != "image") {
		Session.set("link_input_error", "(ಥ~ಥ)This file type is not suported!")
		return
	}

	Session.set("is_loading", true)

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
			Session.set("is_loading", false)
		})
	}
	reader.onerror = function(e) {
		Session.set("internal_filetype_error", "You file error!" + e)
	}
	reader.readAsBinaryString(file)
}
