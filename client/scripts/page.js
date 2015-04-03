

Template.page.events({
	"change .screenselector": function(event) {
		var $target = $(event.target);
		var selected_screen = $target.val()

		Meteor.call("setScreen", this._id, selected_screen)
	},

	"click .remove":function(event) {
		Meteor.call("removePage", this._id)
	}
})