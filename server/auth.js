var Future = Npm.require('fibers/future')


Accounts.registerLoginHandler("kth", function(loginRequest) {
	var future = new Future
	var url = "http://login.datasektionen.se/verify/" + loginRequest.token + ".json"
	Meteor.http.call("GET", url, function(err, data) {
		if(err) {
			console.error(err)
			future.return(undefined)
			return
		}
		var usomething = data.data.user
		var user = Meteor.users.findOne({
			usomething: usomething
		})
		var userId
		if(user) {
			future.return({
				userId: user._id,
				token: loginRequest.token
			})
		} else {
			url = "http://www.csc.kth.se/hacks/new/xfinger/results.php?freetext=" + usomething
			Meteor.http.call("GET", url, function(err, data) {
				if(err) {
					console.error(err)
					future.return(undefined)
					return
				}
				if(data.content.match(/Inget resultat/)) {
					var userId = Meteor.users.insert({
						username: usomething,
						usomething: usomething
					});
					console.log("xfinger did not find the user, created usomething users insted", usomething);
				} else {
					var username = data.content.match(/mailMe\('(\w+)/)[1]
					var userId = Meteor.users.insert({
						username: username,
						usomething: usomething
					})
				}
				console.log("created", userId)
				future.return({
					userId: userId,
					token: loginRequest.token
				})
			})
		}
	})
	return future.wait()
})
