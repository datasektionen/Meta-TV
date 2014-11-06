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
	return user && (user.emails[0].address == doc.createdBy)
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
