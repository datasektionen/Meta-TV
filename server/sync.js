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


var timeout = 30 // s

var cursor = []
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
	if(cursor.length === 0) {
		var tags = []
		var tagsobjs = tagmode.find({}).fetch()
		tagsobjs.forEach(function(tag) {
			tags.push(tag.tag)
		})
		console.log(tags)
		if(tags.length != 0) {
			console.log("haztags")
			cursor = slideshow.find({tags:{$in:tags}}).fetch()
		} else {
			console.log("notagz")
			cursor = slideshow.find({
				onlywhenfiltering: {
					$ne: true
				}
			}).fetch()
		}
	}
	return cursor.pop()
}


syncStream.on("flip", function (message) {
	if (this.userId) {
		reset_interval()
		syncStream.emit('tick', next())
		console.log(this.userId + " flipped slide")
	}
})