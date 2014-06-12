var fs = Npm.require('fs')


slideshow = new Meteor.Collection("slideshow")

Meteor.publish("slideshow", function() {
	var query = slideshow.find()
	return query
})

Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		slideshow.insert({
			type: "external img",
			link: "http://placekitten.com/1920/1080",
			expire: new Date(Date.parse("2012-05-12")),
			createdBy: "anlinn@kth.se"
		})
		slideshow.insert({
			type: "external img",
			link: "http://placecage.com/1920/1080",
			expire: new Date(Date.parse("2015-05-12")),
			createdBy: "anlinn@kth.se"
		})
		slideshow.insert({
			type: "external img",
			link: "https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/77b54f57528c86f6c05ec55d1ce948f1/tumblr_n0zx7rXYk71r8lg7to1_1280.jpg",
			expire: new Date(Date.parse("2015-05-12")),
			createdBy: "anlinn@kth.se"
		})
		slideshow.insert({
			type: "youtube",
			link: "kxopViU98Xo",
			expire: new Date(Date.parse("2015-05-12")),
			createBy: "pintjuk@kth.se"
		})
	}
})


Meteor.methods({
	"file-upload": function(info, data) {
		var path = "../../../../../public/uploaded/" + info.name
		if(info.type.split("/")[0] == "image") {
			fs.writeFileSync(path, new Buffer(data, 'binary'))
		} else {
			console.err("What is this?")
		}
	}
})

slideshow.before.remove(function(userId, doc) {
	try{
		if(doc.type == "local img") {
			var path = "../../../../../public" + doc.link
			fs.unlinkSync(path)
		}
	}catch (err) {
		console.log(err)
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
	remove: function(userId) { return Boolean(userId) },
	update: ok
})
