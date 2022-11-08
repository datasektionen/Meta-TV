var fs = Npm.require('fs')

Router.map(function() {
	this.route('files', {
		path: '/uploaded/:path',
		where: 'server',
		action: function() {
			var path = this.params.path
			var basedir = "../../../../../uploaded/"
			var file = fs.readFileSync(basedir + path)
			this.response.writeHead(200)
			return this.response.end(file)
		}
	});
});


Meteor.methods({
	"file-upload": function(info, data) {
		var path = "../../../../../uploaded/" + info.name
		if(info.type.split("/")[0] == "image") {
			fs.writeFileSync(path, new Buffer(data, 'binary'))
		} else {
			console.err("What is this?")
		}
	}
})
