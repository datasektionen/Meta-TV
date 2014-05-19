slideshow = new Meteor.Collection("slideshow")

Meteor.publish("slideshow", function() {
	return slideshow.find();
})

Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		slideshow.insert({
			name: "Kitten1",
			type: "img",
			link: "http://placekitten.com/1920/1080",
			expire: new Date(Date.parse("2012-05-12")),
			createdBy: "anlinn@kth.se"
		})
		slideshow.insert({
			name: "Next ordförande",
			type: "img",
			link: "http://placecage.com/1920/1080",
			expire: new Date(Date.parse("2015-05-12")),
		})
		slideshow.insert({
			name: "Best teacher",
			type: "img",
			link: "https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/77b54f57528c86f6c05ec55d1ce948f1/tumblr_n0zx7rXYk71r8lg7to1_1280.jpg",
			expire: new Date(Date.parse("2015-05-12")),
		})
	}
})

function cleanUp() {
	console.log("lol")
	slideshow.remove({expire: {$lt: new Date()}})
}
Meteor.setInterval(cleanUp, 10000)

Accounts.config({
	sendVerificationEmail: true,
	restrictCreationByEmailDomain: "kth.se"
})

function ok(userId) {
	return Boolean(userId)
}

slideshow.allow({
	insert: ok,
	remove: ok,
	update: ok
})