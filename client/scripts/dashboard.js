
function getLoginUrl() {
		var callback = ""
		callback += location.protocol + "//"
		callback += location.hostname
		if(location.port) {
			callback += ":" + location.port
		}
		callback += "/login/"
		return "http://login.datasektionen.se/login?callback=" + callback
	}


Template.dashboard.helpers({
	loginurl: getLoginUrl
})
Template.dashboard.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
			window.tbaas_conf = {
					system_name: "Meta-TV",
					target_id: "methone_header",
					primary_color: "#BA68C8",
					secondary_color: "#F3E5F5",
					fuzzyfile: "/Fuzzyfile",
					fuzzy_only: false,
					topbar_items: [
						{
							str: "Overview",
							href: "/overview"
						},
						{
							str: "CH1",
							href: "/slideshow/1"
						},
						{
							str: "CH2",
							href: "/slideshow/2"
						},
						{
							str: "CH3",
							href: "/slideshow/3"
						},
						{
							str: "Report an issue",
							href: "https://github.com/datasektionen/Meta-TV/issues"
						}
					]
				};
				$.getScript('http://methone.froyo.datasektionen.se/bar.js', function() {
					Methone.setLoginButtonText(null);

				});
    }
}

Template.dashboard.events({
	"click .logout": function() {
		Meteor.logout()
	},

	"click .createSlide": function(event) {

		var obj = {
			name: $("#txtName").val(),
			tags:$("#tags").val().split(" "),
			createdBy: Meteor.user().username,
			onlywhenfiltering: $(".hashtagonlyfilter").is(":checked")
		}

		var date = new Date(Date.parse($("#expire").val()))

		if(date != "Invalid Date") {
			var prettyDate = moment(date).fromNow();
			console.log(prettyDate)
			obj.expire = prettyDate
		}

		var report = function(success, identifier){
			if(success){
				var obj_cp = {_id: identifier}
				shallow_copy(obj_cp, obj)
				history_log.insert({
					action: "Added slide",
					by: obj_cp.createdBy,
					time: Date.now(),
					obj: obj_cp,
					tags: obj_cp.tags
				})
			}
		}

		var _id = slideshow.insert(obj)
		report(true, _id)

	}
})

Template.slide.events({
	"click .remove": function() {
		var obj_cp = {}
		shallow_copy(obj_cp, this)
		history_log.insert({
			action: "Removed slide",
			by: Meteor.user().username,
			time: Date.now(),
			obj: obj_cp,
			tags: obj_cp.tags
		})
		slideshow.remove({_id: this._id})
	},
	"click .edit": function() {
		if(Session.equals("hazEdit", this._id)){
			Session.set("hazEdit", null)
		}else{
			Session.set("hazEdit", this._id)
		}
	},
	"click .update": function(){
		var obj_cp = {}
		shallow_copy(obj_cp, this)
		history_log.insert({
			action:"Updated slide",
			by:Meteor.user().username,
			time:Date.now(),
			note:"obj represents the state of the slide before update",
			obj:obj_cp
		})
		slideshow.update({_id:this._id}, {$set: {body: $(".update_markdown").val()}})
		Session.set("hazEdit", null)
	}
})


Template.tagfiltering.events({
	"click .remover": function() {
		tagmode.remove({_id: this._id})
	},
	"click button": function() {
		tagmode.insert({
			tag: $(".adders").val(),
			createdBy: Meteor.user().username // Yes it is checked on the server
		})
		$(".adders").val("")
	}
})
