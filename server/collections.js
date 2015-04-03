slideshow = new Meteor.Collection("slideshow")
history = new Meteor.Collection("history")
tagmode = new Meteor.Collection("tagmode")

Meteor.publish("slideshow", function() {
	return slideshow.find()
})

Meteor.publish("history", function() {
	return history.find()
})

Meteor.publish("tagmode", function() {
	return tagmode.find()
})

function loggedinAndOwned(userId, doc) {
	var user = Meteor.users.findOne({_id: userId})
	return user && (user.username == doc.createdBy)
}

function loggedin(userId) {
	return Boolean(userId)
}

slideshow.allow({
	insert: loggedinAndOwned,
	remove: loggedin,
	update: loggedin
})

tagmode.allow({
	insert: loggedinAndOwned,
	remove: loggedin,
	update: loggedinAndOwned
})

history.allow({
	insert: loggedin,
	remove: function(){
		return false
	},
	update: function(){
		return false
	}
})

Meteor.methods({
	setScreen: function(pageId, screenId) {
		if (! Meteor.userId()) {
      		throw new Meteor.Error("not-authorized");
    	}

		slideshow.update({"pages._id": pageId},
			{$set: {"pages.$.screen": screenId}})
	},

	insertSlide: function(slideId, obj) {
		console.log(obj)
		console.log(slideId)

		slideshow.update({_id: slideId}, {$push:{pages:obj}})
	},

	removePage: function(pageId) {
		console.log(pageId)

		slideshow.update({"pages._id": pageId},
			{$pull: {"pages": {_id: pageId}}})
	}
})