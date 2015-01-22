function cleanUp() {
	slideshow.remove({expire: {$lt: new Date()}})

	// If between midnight and one clocn
	var now = new Date()
	var cleanuphour = new Date()
	cleanuphour.setHours(5, 0, 0, 0)
	var end = new Date()
	end.setHours(6, 0, 0, 0)
	if(cleanuphour < now && now < end) {
		console.log("Resetting tags")
		tagmode.remove({})
	}
}
Meteor.setInterval(cleanUp, 10000)