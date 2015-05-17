var Home = (function() {
	return 	{
		onload : function() {
			$('#form-main').submit(Home.findgems);
			$.fn.wrapInTag = function(opts) {
			  var tag = opts.tag || 'strong'
			    , words = opts.words || []
			    , regex = RegExp(words.join('|'), 'gi') // case insensitive
			    , replacement = '<'+ tag +'>$&</'+ tag +'>';

			  return this.html(function() {
			    return $(this).text().replace(regex, replacement);
			  });
			};
		},

		findgems : function(e) {
			e.preventDefault();
			// Get the usertext
			usertext  = {};
			usertext.body = $('#usertext').val();
			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: "/findgems",
				data: JSON.stringify(usertext),
				dataType: "json",
				success: Home.rendergems
			});
		},

		rendergems : function(response) {
			alert(response.gems);
		 	gems = response.gems.split(', ');
		 	userText = $('#usertext').val()
		 	for(i=0;i<gems.length;i++){
		 		alert(gems[i]);
		 	}
			$('#form-main').hide();
			$('#gems').append(userText);
			$('#gems').wrapInTag({
			  tag: 'gem',
			  words: gems
			});
		}
	};
})();

$(document).ready(Home.onload);