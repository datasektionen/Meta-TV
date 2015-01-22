Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		slideshow.insert({		// Should be removed on first cleanup
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
			"body":"<iframe src=\"http://limbero.com/projects/metasl/\" style=\"width: 100vw; height: 100vh; border: none;\"></iframe>"
		})
	}
})