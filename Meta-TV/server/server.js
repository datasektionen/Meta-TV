slideshow = new Meteor.Collection("slideshow")


Meteor.startup(function () {
	// Sample data
	if (slideshow.find().count() == 0) {
		slideshow.insert({
			type: "img",
			link: "http://placekitten.com/1920/1080",
			expire: new Date(Date.parse("2015-05-12"))
		})
		slideshow.insert({
			type: "img",
			link: "http://placecage.com/1920/1080",
			expire: new Date(Date.parse("2015-05-12"))
		})
		slideshow.insert({
			type: "img",
			link: "https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/77b54f57528c86f6c05ec55d1ce948f1/tumblr_n0zx7rXYk71r8lg7to1_1280.jpg",
			expire: new Date(Date.parse("2015-05-12"))
		})
	}
})

