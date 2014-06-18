Template._loginButtonsMessages.infoMessage = "@kth.se mail required"

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

Template.slide.events({
	"click .remove": function() {
		var obj_cp = {}
		shallow_copy(obj_cp, this)
		history_log.insert({
			action:"Removed slide",
			by:Meteor.user().emails[0].address,
			time:Date.now(),
			obj:obj_cp,
			tags:obj_cp.tags
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
