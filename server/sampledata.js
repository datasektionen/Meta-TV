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
			"type":"website",
			"tags":["sl", "random"],
			"createdBy":"blu@kth.se",
			"link":"http://limbero.com/projects/metasl/"
		})
	}
})