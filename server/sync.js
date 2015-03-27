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

var timeout = 30 // s

var counter = 0;
var sync_interval;

function start_interval() {
	sync_interval = Meteor.setInterval(function() {
	    syncStream.emit('tick', next());
	}, timeout * 1000);
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

		var grouping = [];

		for (var i in cursor) {
			var ch = cursor[i].channel ? cursor[i].channel : 0
			if (grouping.length < ch || grouping[ch] == undefined) {
				grouping[ch] = [cursor[i]]
			} else {
				grouping[ch].push(cursor[i]);
			}
		}

		var retval = {
			switchtime: new Date().getTime() + 5000
		}

		for (var i = 0; i < grouping.length; i++) {
			if (grouping[i]) {
				retval[i] = grouping[i][counter % grouping[i].length]._id
			}
			
		}

		return retval
	}


