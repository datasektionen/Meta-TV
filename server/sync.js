/**
 * The sync stream syncs image change across clients.
 */

syncStream = new Meteor.Stream('sync');

syncStream.permissions.write(function(eventName) {
    return false;
});

syncStream.permissions.read(function(eventName) {
	return true;
});


syncStream.on("flip", function (message) {
	if (this.userId) {
		reset_interval()
		var n = next()
		syncStream.emit('tick', n)
		console.log(n)
		console.log(this.userId + " flipped slide")
	}
})

var timeout = 30 * 1000 // ms

var counter = 0
var sync_interval
const NUM_SCREENS = 15
const SWITCH_DELAY = 5 * 1000 // ms

function start_interval() {
	sync_interval = Meteor.setInterval(function() {
	    syncStream.emit('tick', next());
	}, timeout);
}

function reset_interval() {
	Meteor.clearInterval(sync_interval)
	start_interval()
}

start_interval()

function next() {
		counter++;
		var tags = []
		var cursor;
		var tagsobjs = tagmode.find({}).fetch()
		tagsobjs.forEach(function(tag) {
			tags.push(tag.tag)
		})

		if(tags.length != 0) {
			cursor = slideshow.find({tags:{$in:tags}}).fetch()
		} else {
			cursor = slideshow.find({
				onlywhenfiltering: {
					$ne: true
				}
			}).fetch()
		}

		var slide = cursor[counter % cursor.length]

		var retval = {
			switchtime: new Date().getTime() + 5000
		}

		if (slide.pages.length > 1) {
			/* 
			Several pages. Show page 1 on screen 1 etc.
			*/
			for (var i = 0; i < NUM_SCREENS; i++)
				retval[i] = "" // Fill empty screens

			for (var i in slide.pages) {
				var page = slide.pages[i]
				retval[page.screen] = page._id.toHexString()
			}

		} else {
			// Single page. Repeat on each screen.
			for (var i = 0; i < NUM_SCREENS; i++)
				retval[i] = slide.pages[0]._id.toHexString()
		}
	
		return retval
	}


