function shallow_copy(to, from, ignore){
	for(var key in from){
		if(!ignore|| ignore.indexOf(key)==-1)
      to[key] = from[key]
	}
}
window.shallow_copy = shallow_copy

Handlebars.registerHelper("equals", function ( a, b) {
  return (a==b);
});

Handlebars.registerHelper("members", function (a) {
	var res=[];
	for(var key in a){
		res.push({
			"key":key,
			"value": a[key]
		})
	}
	return res
});

Handlebars.registerHelper("prettydate", function (date) {
	var prettyDate = moment(date).fromNow();
	return prettyDate
});

Handlebars.registerHelper("dateinput", function (date) {
	if (date) {
		var shortdate = date.toJSON().slice(0,10);
		return shortdate
	} else {
		return ""
	}
});