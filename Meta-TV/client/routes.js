Router.map(function() {
	this.route('slideshow', {
		path: '/',
		data: function() {
			update()
		}
	})
	this.route('history', {
		path: '/history',
		data: function() {
			return {
				history: history_log.find({}, {sort: {time:-1}})
			}
		}
	})
	this.route('dashboard', {
		path: '/dashboard',
		data: function() {
			return {
				slides: slideshow.find({}),
				history: history_log.find({}, {sort: {time:-1}}),
				tagmode: tagmode.find({})
			}
		}
	})
})