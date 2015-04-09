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
					"link":"http://placekitten.com/1200/800"
				}
			]
		})
	}
})