Router.map(function() {
	this.route('slideshow', {
		path: '/',
		data: function() {
			update()
		}
	}),
	this.route('slideshow', {
		path: '/tag/:tag',
		data: function() {
			console.log(this.params.tag.split("+"))
			update(this.params.tag.split("+"))
		}
	}),
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
				history: history_log.find({}, {sort: {time:-1}})
			}
		}
	})
	this.route('dashboard', {
		path: '/dashboard/:tag',
		data: function() {
			return {
				defoult_tag:this.params.tag,
				slides: slideshow.find({tags:this.params.tag}),
				history: history_log.find({tags:this.params.tag}, {sort: {time:-1}})
			}
		}
	})
})