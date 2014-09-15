var fs = Npm.require('fs')


slideshow = new Meteor.Collection("slideshow")
history = new Meteor.Collection("history")

Meteor.publish("slideshow", function() {
	var query = slideshow.find()
	return query
})

Meteor.publish("history", function() {
	var query = history.find()
	return query
})

Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		slideshow.insert({
			type: "external img",
			link: "http://placekitten.com/1920/1080",
			expire: new Date(Date.parse("2012-05-12")),
			createdBy: "anlinn@kth.se",
			tags: ["2"]
		})
		slideshow.insert({
			"type":"html",
			"tags":["random"],
			"createdBy":"blu@kth.se",
			"body":"<iframe src=\"http://limbero.com/projects/metasl/\" style=\"width: 100%; height: 100vh; border: none;\"></iframe>"
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

history.allow({
	insert:function(userId) { return Boolean(userId) },
	remove:function(){
		return false
	},
	update:function(){
		return false
	}
})
