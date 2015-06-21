var lookup = {};

var Home = (function() {
	_toggleUserSelection = function() {
		if($('#radio-all').is(":checked")){
			$('#gems .not-gem').show();
		}else if($('#radio-gemsonly').is(":checked")){
			$('#gems .not-gem').hide();
		}
	}, 
	_getTagreplacementText = function(tag,text) {
		min  = 15;
		max = 24;
		arr = Object.keys(lookup).map(function ( key ) { return lookup[key]; });
		curr_min = Math.min.apply( null, arr );
		curr_max = Math.max.apply( null, arr );
		fontsize = ((lookup[text.toLowerCase()]/curr_max) * (max - min)) + min;
		replacementText = '<'+ tag +'style=\"font-size:'+fontsize+'px\"">'+text+'</'+ tag +'>';
		return replacementText;
	}	
	return 	{
		onload : function() {
			$('#form-main').submit(Home.findgems);
			$.fn.wrapInTag = function(opts) {
			  var tag = opts.tag || 'strong'
			    , words = opts.words || []
			    , regex = RegExp(words.join('|'), 'gi') // case insensitive
			    , replacement = '<'+ tag +'>$&</'+ tag +'>';

			  return this.html(function() {
			    return $(this).text().replace(regex, function(text) { return _getTagreplacementText(tag,text);});
			  });
			};
			$('#radio-all').click(_toggleUserSelection);
			$('#radio-gemsonly').click(_toggleUserSelection);
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
		 	gems = response;
		 	lookup = {};		 	
		 	for(i=0;i<gems.length;i++){
		 		lookup[gems[i].name]=gems[i].weight;
		 	}
		 	userText = $('#usertext').val();		 	
			$('#form-main').hide();
			$('#userselection').show();
			$('#gems').show();
			$('#gems').append(userText);
			$('#gems').wrapInTag({
			  tag: 'gem class=\"gem\"',
			  words: Object.keys(lookup)
			});
			$('#gems').contents()
		        .filter(function(){return this.nodeType === 3})
		        .wrap('<span class="not-gem" />');
			//Home.animategems();
		},

		animategems : function() {
			$('.gem').each(function() {
				$(this).stop().animate({
		        fontSize: '24px'}, 10000)
			});
		}

	};
})();

$(document).ready(Home.onload);