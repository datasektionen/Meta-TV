slideshow = new Meteor.Collection("slideshow")

Meteor.publish("slideshow", function() {
	return slideshow.find();
})

Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		slideshow.insert({
			type: "img",
			link: "http://placekitten.com/1920/1080",
			expire: new Date(Date.parse("2012-05-12")),
			createdBy: "anlinn@kth.se"
		})
		slideshow.insert({
			type: "img",
			link: "http://placecage.com/1920/1080",
			expire: new Date(Date.parse("2015-05-12")),
			createdBy: "anlinn@kth.se"
		})
		slideshow.insert({
			type: "img",
			link: "https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/77b54f57528c86f6c05ec55d1ce948f1/tumblr_n0zx7rXYk71r8lg7to1_1280.jpg",
			expire: new Date(Date.parse("2015-05-12")),
			createdBy: "anlinn@kth.se"
		})
	}
})

function cleanUp() {
	slideshow.remove({expire: {$lt: new Date()}})
}
Meteor.setInterval(cleanUp, 10000)

Accounts.config({
	sendVerificationEmail: true,
	restrictCreationByEmailDomain: "kth.se"
})

function ok(userId, doc) {
	var user = Meteor.users.findOne({_id: userId})
	return user && (user.emails[0].address == doc.createdBy)
}

slideshow.allow({
	insert: ok,
	remove: function(usersId) { return Boolean(userId) },
	update: ok
})