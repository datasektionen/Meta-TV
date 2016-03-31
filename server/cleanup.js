function cleanUp() {
	//Find all that is about to expire and add them to the history.
	slideshow.find({expire: {$lt: new Date()}}).forEach(function(obj) {
		history.insert({
			action:"Expired slide",
			by:"GLaDOS",
			time:Date.now(),
			obj:obj
		})
	})

	//Now remove the ones that expired.
	slideshow.remove({expire: {$lt: new Date()}})

	// If between midnight and one clocn
	var now = new Date()
	var cleanuphour = new Date()
	cleanuphour.setHours(5, 0, 0, 0)
	var end = new Date()
	end.setHours(6, 0, 0, 0)
	if(cleanuphour < now && now < end) {
		console.log("Reseting tags")
		tagmode.remove({})
	}
}
Meteor.setInterval(cleanUp, 10000)