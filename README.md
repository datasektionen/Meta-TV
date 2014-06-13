META TV
=======

Hacky application for displaying news and stuff running on the monitors where we eat lunch. Using great strategies like if it crashes il just fix it and if someone cracks we all get a laugh.

Setup

	http://nodejs.org/
	install meteor https://www.meteor.com/
	http://oortcloud.github.io/meteorite/
	git clone https://github.com/sootn/Meta-TV.git
	cd Meta-TV/
	mrt install
	mrt run
	open http://localhost:3000
	
Log
---
To view log open http://localhost:3000/history.
Every action can be reverted.(there is no authentication, so don't tell enyone)


Tags
----

To view slideshow filterd by a tag go to http://localhost:3000/tag/{{tag}} where {{tag}} is the tag you want to use
