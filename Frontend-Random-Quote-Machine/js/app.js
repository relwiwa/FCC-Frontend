$(document).ready(function() {

	// Object for Random Quote Machine functions and properties
	var RQM = {}; 
	
	/* Offline quotes:
	   - They are used as a fallback, when there is no internet connection or API not functioning well
		 - When all of them have been used once, they get resued */
	RQM.offlineQuotes = [
		{
			content: "To expect the unexpected shows a thoroughly modern intellect.",
			title: "Oscar Wilde"
		},
		{
			content: "Design is not just what it looks like and feels like. Design is how it works.",
			title: "Steve Jobs"
		},
		{
			content: "Fashion fades, only style remains the same.",
			title: "Coco Channel"
		},
		{
			content: "I don't design clothes, I design dreams.",
			title: "Ralph Lauren"
		},
		{
			content: "Any product that needs a manual to work is broken.",
			title: "Alan Musk"
		}
	];
	RQM.offlineQuotesUsed = [];

	/* getQuote function
	   - Gets one quote per call from API
		 - Calls changeQuote function
		 - Starts animation unless it's the first quote
		 - Selects offline quote if the api access failed
		 - Manages offline quotes */
	RQM.getQuote = function() {

		$.ajax({
			url: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
			cache: false // this is necessary for cross domain request to work, don't know why!!
		})
		
		.done(function(data) {
			
			/* Start fade out animation, unless it is the first quote we get */
			if ($("#quote").text() !== "") {
				$("#content").animate({
					opacity:0
				}, 800, function() {
				  RQM.changeQuote(data[0].content, data[0].title);
				});
			}
			else {
			  RQM.changeQuote(data[0].content, data[0].title);
			}
		})
		
		// API request failed, so we use offline quotes
		.fail(function(error) {

			var offlineQuote;

			// basic random selection, it could be implemented better by splitting the arrays at random positions
			if (Math.random() > 0.5) {
				offlineQuote = RQM.offlineQuotes.pop();
			} else {
				offlineQuote = RQM.offlineQuotes.shift();
			}

			// animation unless its the first element
			if ($("#quote").text() !== "") {
				$("#content").animate({
					opacity:0
				}, 800, function() {
					RQM.changeQuote(offlineQuote.content, offlineQuote.title);
				});
			}
			else {
				RQM.changeQuote(offlineQuote.content, offlineQuote.title);
			}		
			RQM.offlineQuotesUsed.push(offlineQuote);
			
			// We have used all offline quotes, so we restart we the same quotes
			if (RQM.offlineQuotes.length === 0)  {
				RQM.offlineQuotes = RQM.offlineQuotesUsed;
				RQM.offlineQuotesUsed = [];
			}
		});
	};

	/* changeQuote function
	   - Puts first or new quote and author into content area, using an animation
		 - Also applies necessary replacments within the API string for forwarding to Twitter and updates Twitter link */
	
	RQM.changeQuote = function(content, title) {

		$("#quote").html(content);
		$("#author").html(title);
		$("#content").animate({
			opacity:1
		}, 1000);
		
		// Escaping single and double quotes and deleting HTML tags before encodeURIComponent function
		var contentEscaped = content + " (" + title + ")"; 
		contentEscaped = contentEscaped.replace(/&#8217;/g, "'")
			.replace(/&#8216;/g, "'")
			.replace(/&#8220;/g, '"')
			.replace(/&#8221;/g, '"')
		  .replace(/<[A-Za-z0-9]+>/g, "")
		  .replace(/<\/[A-Za-z0-9]+>/g, "");
		contentEscaped = encodeURIComponent(contentEscaped);
		$("#twitter").attr("href", "https://twitter.com/intent/tweet?text=" + contentEscaped);
	}

	/* Event Listeners */	
	$("#nextQuote").click(function()  {
		RQM.getQuote();
	});
	
	/* Starting it by getting first quote */
	RQM.getQuote();	
	
});