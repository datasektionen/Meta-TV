history_log = new Meteor.Collection("history")
Meteor.subscribe("history")

var lets_create_history = function(action, obj) {
	history_log.insert({
		action:action,
		by:Meteor.user().username,
		time:Date.now(),
		note: "history-object created by a revert",
		obj:obj
	})
}
Template.history.events({
	"click .revert": function(){
		// Revert currently supports 6 cases as outlined below.
		// the action name in history is the opposite action to undo what the revert did.
		if(this.action=="Added page"){
			lets_create_history("Removed page", this.obj)
			Meteor.call("removePage", this.obj._id)
		} else if(this.action=="Removed page"){
			lets_create_history("Added page", this.obj)
			Meteor.call("insertSlide", this.obj.parentid, this.obj)
		} else if(this.action=="Added slide"){
			lets_create_history("Removed slide", this.obj)
			slideshow.remove({_id: this.obj._id})
		} else if(this.action=="Removed slide"){
			lets_create_history("Added slide", this.obj)
			slideshow.insert(this.obj)
		} else if(this.action=="Updated tags/expiry"){
			lets_create_history("Updated tags/expiry", this.obj)
			slideshow.remove({_id: this.obj._id})
			slideshow.insert(this.obj)
		} else if(this.action=="Expired slide"){
			this.obj.expire=undefined //Set it to never expire so it does not get autoremoved again.
			lets_create_history("Added slide", this.obj) //The opposite action is adding slide.
			slideshow.insert(this.obj)
		}
	}
})