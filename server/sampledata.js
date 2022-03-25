Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		console.log("Inserting sample data")
		slideshow.insert({
			"_id":"aLTtLyH5Yo7iPMLKB",
			"name":"test",
			"tags":[
				"random"
			],
			"createdBy": "anlinn",
			"onlywhenfiltering": false,
			"pages":[
				{
					"_id":"be9ab7857129d0709824d21d",
					"type":"external img",
					"createdBy":"anlinn",
					"screen":"1",
					"badDimensions":true,
					"link":"http://placekitten.com/1200/800"
				}
			]
		});
		slideshow.insert({
			"_id":"87209570294",
			"name":"test2",
			"tags":[
				"random"
			],
			"createdBy": "hermanka",
			"onlywhenfiltering": false,
			"pages":[
				{
					"_id":"45245234532452345",
					"type":"website",
					"createdBy":"hermanka",
					"screen":"1",
					"link":"https://example.net"
				}
			]
		})
	}
});