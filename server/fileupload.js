var fs = Npm.require('fs')
var path = Npm.require('path')

var basedir = "../../../../../uploaded/"

Router.map(function() {
	this.route('files', {
		path: '/uploaded/:path',
		where: 'server',
		action: function() {
			var p = path.join(basedir, this.params.path)
            if (!p.startsWith(basedir)) {
                this.response.writeHead(400)
                return this.response.end()
            }
			var file = fs.readFileSync(p)
			this.response.writeHead(200)
			return this.response.end(file)
		}
	});
});


Meteor.methods({
	"file-upload": function(info, data) {
		var p = path.join(basedir, info.name)
        if (!p.startsWith(basedir)) {
            this.response.writeHead(400)
            return this.response.end()
        }
		if(info.type.split("/")[0] == "image") {
			fs.writeFileSync(path, new Buffer(data, 'binary'))
		} else {
			console.err("What is this?")
		}
	}
})
