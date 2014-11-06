Meteor.loginWithKth = function(token, callback) {
	if (!Meteor.user()) {
		Accounts.callLoginMethod({
			methodArguments: [{
				token: token
			}],
			userCallback: callback
		})
	}
	else if(callback) {
		callback()
	}
}