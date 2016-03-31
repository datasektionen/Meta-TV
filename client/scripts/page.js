Template.page.events({
	"change .screenselector": function(event) {
		var $target = $(event.target);
		var selected_screen = $target.val()

		Meteor.call("setScreen", this._id, selected_screen)
	},

	"click .removepage":function(event) {
		history_log.insert({
			action: "Removed page",
			by: Meteor.user().username,
			time: Date.now(),
			parentid: this._id,
			name: this.name,
			obj: this,
		})
		Meteor.call("removePage", this._id)
	}
})
