Template.dashboard.helpers({
	loginurl: function() {
		var callback = ""
		callback += location.protocol + "//"
		callback += location.hostname
		if(location.port) {
			callback += ":" + location.port
		}
		callback += "/login/"
		return "http://login.datasektionen.se/login?callback=" + callback
	}
})

Template.dashboard.events({
	"click .logout": function() {
		Meteor.logout()
	}
})

Template.slide.events({
	"click .remove": function() {
		var obj_cp = {}
		shallow_copy(obj_cp, this)
		history_log.insert({
			action: "Removed slide",
			by: Meteor.user().username,
			time: Date.now(),
			obj: obj_cp,
			tags: obj_cp.tags
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
			by:Meteor.user().username,
			time:Date.now(),
			note:"obj represents the state of the slide before update",
			obj:obj_cp
		})
		slideshow.update({_id:this._id}, {$set: {body: $(".update_markdown").val()}})
		Session.set("hazEdit", null)
	}
})


Template.tagfiltering.events({
	"click .remover": function() {
		tagmode.remove({_id: this._id})
	},
	"click button": function() {
		tagmode.insert({
			tag: $(".adders").val(),
			createdBy: Meteor.user().username // Yes it is checked on the server
		})
		$(".adders").val("")
	}
})