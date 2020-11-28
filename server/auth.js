var Future = Npm.require('fibers/future')


Accounts.registerLoginHandler("kth", function(loginRequest) {
	var future = new Future
	var url = "https://login.datasektionen.se/verify/" + loginRequest.token + ".json"
	Meteor.https.call("GET", url, {params: {api_key: process.env.LOGIN_KEY}} ,function(err, data) {
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
