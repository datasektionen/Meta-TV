history_log = new Meteor.Collection("history")
Meteor.subscribe("history")

Template.history.events({
	"click .revert": function(){
		if(this.action=="Removed slide"){
			this.obj.createdBy = Meteor.user().emails[0].address
			slideshow.insert(this.obj)
			history_log.insert({
				action:"Added slide",
				by:Meteor.user().emails[0].address,
				time:Date.now(),
				obj:this.obj,
				tags:this.obj.tags
			})
		} else if(this.action=="Added slide"){
			console.log("removing silde")
			history_log.insert({
				action:"Removed slide",
				by:Meteor.user().emails[0].address,
				time:Date.now(),
				obj:this.obj,
				tags:this.obj.tags
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
				obj:obj_cp,
				tags:obj_cp.tags
			})
			obj_cp={}
			shallow_copy(obj_cp, this.obj, ["_id"])
			slideshow.update({_id:this.obj._id}, {$set: obj_cp})
		}
	}
})