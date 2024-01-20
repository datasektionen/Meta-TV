var Future = Npm.require('fibers/future')

var banlist = (process.env.BANLIST || "").split(",")

Accounts.registerLoginHandler("kth", function(loginRequest) {
	var future = new Future
	var url = "https://login.datasektionen.se/verify/" + loginRequest.token + ".json"
	Meteor.http.call("GET", url, {params: {api_key: process.env.LOGIN_KEY}} ,function(err, data) {
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
			for (var i = 0; i < banlist.length; i++) {
				if (banlist[i] == user.username) {
					console.log("Denied log in of banned user", user.username)
					future.return(undefined)
					return
				}
			}
			future.return({
				userId: user._id,
				token: loginRequest.token
			})
		} else {
			var userId = Meteor.users.insert({
				username: usomething,
				usomething: usomething
			});
	
			console.log("created", userId)
			future.return({
				userId: userId,
				token: loginRequest.token
			})
		}
	})
	return future.wait()
})
