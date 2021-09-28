
function getLoginUrl() {
		var callback = ""
		callback += location.protocol + "//"
		callback += location.hostname
		if(location.port) {
			callback += ":" + location.port
		}
		callback += "/login/"
		return "https://login.datasektionen.se/login?callback=" + callback
	}


Template.dashboard.helpers({
	loginurl: getLoginUrl
})
Template.dashboard.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
			window.tbaas_conf = {
					system_name: "Meta-TV",
					target_id: "m_header",
					primary_color: "#009688",
					secondary_color: "#F3E5F5",
					fuzzyfile: "",
					fuzzy_only: false,
					delta_invert: true,
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
							str: "History",
							href: "/history"
						},
						{
							str: "Report an issue",
							href: "https://github.com/datasektionen/Meta-TV/issues"
						}
					]
				};
				$.getScript('//methone.datasektionen.se', function() {
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
			//If you want to change how the date is visually displayed see slide.html
			obj.expire = date
		}

		var report = function(success, identifier) {
			if(success) {
				var obj_cp = {_id: identifier}
				shallow_copy(obj_cp, obj)
				history_log.insert({
					action: "Added slide",
					by: obj_cp.createdBy,
					time: Date.now(),
					obj: obj_cp,
				})
			}
		}

		var _id = slideshow.insert(obj)
		report(true, _id)
		Router.go("/#" + _id) //Redirects to the newly created slide.

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
			action:"Updated name/tags/expiry",
			by:Meteor.user().username,
			time:Date.now(),
			note:"obj represents the state of the slide before update",
			obj:obj_cp
		})
		var tagstring = $("#tags" + this._id).val().trim()
		var date =  new Date(Date.parse($("#expire" + this._id).val()))
		//Get new name
		var name = $("#name" + this._id).val().trim()
		//Set new name to old if empty
		if (name === "") name = obj_cp.name

		if(date != "Invalid Date") {
			slideshow.update({_id:this._id}, {$set: {name: name, expire: date, tags: tagstring.split(" ")}})
		} else {
			slideshow.update({_id:this._id}, {$set: {name: name, expire: undefined, tags: tagstring.split(" ")}})
		}
		Session.set("hazEdit", null)
	}
})


Template.filters.events({
	"click .remover": function() {
		tagmode.remove({_id: this._id})
	},
	"click button": function() {
		tagmode.insert({
			tag: $(".taginput").val(),
			createdBy: Meteor.user().username // Yes it is checked on the server
		})
		$(".taginput").val("")
	}
})
