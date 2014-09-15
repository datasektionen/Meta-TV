Template.uploader.internal = function() {
	return Session.get("type") == "local img"
}

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

Template.uploader.isYoutube = function() {
	return Session.get("type") == "youtube"
}

Template.uploader.isMarkdown= function(){
	return Session.get("type")=="markdown"
}

Template.uploader.isHTML= function(){
	return Session.get("type")=="html"
}

Template.uploader.internal_filetype_error=function(){
	return Session.get("internal_filetype_error") || ""
}

Template.uploader.link_input_error=function(){
	return Session.get("link_input_error") || ""
}

Template.slide.canhazedit=function(){
	return Session.get("hazEdit") == this._id
}

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
			createdBy: Meteor.user().emails[0].address
		}
		var date = new Date(Date.parse($(".expire").val()))

		if(date != "Invalid Date") {
			obj.expire = date
		}

		var report = function(success, identifier){
			if(success){
				var obj_cp = {_id:identifier}
				shallow_copy(obj_cp, obj)
				history_log.insert({
					action:"Added slide",
					by:obj_cp.createdBy,
					time:Date.now(),
					obj:obj_cp,
					tags:obj_cp.tags
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
		}
		$(".expire").val("")
	}
})

var send_local_img = function(obj){
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
		setTimeout(function(){
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
		}, 100);
	}
	reader.readAsBinaryString(file)
}

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