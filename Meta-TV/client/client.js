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

function shallow_copy(to, from, ignore){

	for(var key in from){
		if(!ignore|| ignore.indexOf(key)==-1)
      to[key] = from[key]
	}
}

Handlebars.registerHelper("equals", function ( a, b) {
  return (a==b);
});

Handlebars.registerHelper("members", function (a) {
	var res=[];
	for(var key in a){
		res.push({
			"key":key,
			"value": a[key]
		})
	}
	return res
});


slideshow = new Meteor.Collection("slideshow")
Meteor.subscribe("slideshow")

history_log = new Meteor.Collection("history")
Meteor.subscribe("history")

var cursor = []

Router.map(function() {
	this.route('slideshow', {
		path: '/',
		data: function() {
			update()
		}
	}),
	this.route('slideshow', {
		path: '/tag/:tag',
		data: function() {
			update(this.params.tag)
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
	}),
	this.route('history', {
		path: '/history',
		data: function() {

		}
	})
	this.route('dashbord', {
		path: '/dashbord',
		data: function() {

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

Template.slides.isYoutube = function() {
	return Session.get("type") == "youtube"
}

Template.slides.isMarkdown= function(){
	return Session.get("type")=="markdown"
}

Template.slides.isHTML= function(){
	return Session.get("type")=="html"
}

Template.slides.internal_filetype_error=function(){
	return Session.get("internal_filetype_error") || ""
}

Template.slides.link_input_error=function(){
	return Session.get("link_input_error") || ""
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

Template.slides.events({
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
					obj:obj_cp
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

Template.slide.events({
	"click .remove": function() {
		var obj_cp = {}
		shallow_copy(obj_cp, this)
		history_log.insert({
			action:"Removed slide",
			by:Meteor.user().emails[0].address,
			time:Date.now(),
			obj:obj_cp
		})
		slideshow.remove({_id: this._id})
	},
	"click .edit": function() {
		if(Session.equals("hazEdit", this._id)){
			Session.set("hazEdit", null)
		}else{
			Session.set("hazEdit", this._id)
		}
	},
	"click .update": function(){
		var obj_cp = {}
		shallow_copy(obj_cp, this)
		history_log.insert({
			action:"Updated slide",
			by:Meteor.user().emails[0].address,
			time:Date.now(),
			note:"obj represents the state of the slide before update",
			obj:obj_cp
		})
		slideshow.update({_id:this._id}, {$set: {body: $(".update_markdown").val()}})
		Session.set("hazEdit", null)
	}
})

Template.slide.canhazedit=function(){
	return Session.get("hazEdit") == this._id
}

Template.history.log=function(){
	return history_log.find({}, {sort: {time:-1}})
}

Template.history.events({
	"click .revert": function(){
		if(this.action=="Removed slide"){
			slideshow.insert(this.obj)
			history_log.insert({
				action:"Added slide",
				by:Meteor.user().emails[0].address,
				time:Date.now(),
				obj:this.obj
			})
		} else if(this.action=="Added slide"){
			console.log("removing silde")
			history_log.insert({
				action:"Removed slide",
				by:Meteor.user().emails[0].address,
				time:Date.now(),
				obj:this.obj
			})
			slideshow.remove({_id: this.obj._id})
		} else if(this.action=="Updated slide"){
			var curentObj=slideshow.find({_id:this.obj._id})
			if(curentObj.count==0)
				return
			var obj_cp={}
			shallow_copy(obj_cp, curentObj.fetch()[0])
			history_log.insert({
				action:"Updated slide",
				by:Meteor.user().emails[0].address,
				time:Date.now(),
				obj:obj_cp
			})
			obj_cp={}
			shallow_copy(obj_cp, this.obj, ["_id"])
			slideshow.update({_id:this.obj._id}, {$set: obj_cp})
		}
	}
})

Template.history.test_html = function(){
	return "<h1> This is html </h1>"
}

function update(tag) {
	if(cursor.length === 0) {
		if(tag){
			console.log("haztags")
			cursor = slideshow.find({tags:tag}).fetch()
		}else{
			console.log("notagz")
			cursor = slideshow.find().fetch()
		}
	}
	Session.set("current", cursor.pop())
}
setInterval(update, timeout * 1000)
