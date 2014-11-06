Router.route('/', function() {
	this.render('slideshow', {
		data: function() {
			update()
		}
	})
})
Router.route('/history', function() {
	this.render('history', {
		data: function() {
			return {
				history: history_log.find({}, {sort: {time:-1}})
			}
		}
	})
})
Router.route('/dashboard', function() {
	this.render('dashboard', {
		data: function() {
			return {
				slides: slideshow.find({}),
				history: history_log.find({}, {sort: {time:-1}}),
				tagmode: tagmode.find({})
			}
		}
	})
})

Router.route('/login/:token', function() {
	Meteor.loginWithKth(this.params.token, function() {
		Router.go("/dashboard")
	})
})
