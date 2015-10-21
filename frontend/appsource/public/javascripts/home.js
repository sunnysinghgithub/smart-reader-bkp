var Home = (function() {
	_toggleUserSelection = function() {
		showeverything = $('#checkbox-usersel').bootstrapSwitch('state');
		if(showeverything){
			$('#gems .not-gem').fadeIn("slow");
		}else {
			$('#gems .not-gem').fadeOut("slow");
		}
	},
	_bindEventHandlers = function() {
		$("#btn-home").click(function() {
			location.href="/home";
		});
		$('#form-main').submit(Home.findGems);
		$('#btn-start-over').click(function() {
			$(".result").hide('slide',{direction: 'right'}, 200, function() {
				// Slide in the header
				$("#header").show('slide',{direction: 'left'}, 200);
				// Slide in the Home section
				$('#form-main').show('slide',{direction: 'left'}, 200);
			});
		});
		$("#btn-login").fancybox({
		    autoScale: true,
		    autoSize: false,
		    href : '#login',
		    padding: 0,
		    closeClick : false,
		    titleShow : false,
        	transitionIn : 'elastic',
        	transitionOut : 'elastic',
        	width: '800px',
        	height: '390px'
		}); // fancybox
	},
	_showDisplaySwitch = function() {
		$('#checkbox-usersel').bootstrapSwitch({
			onText: "All", 
			offText: "Gems", 
			offColor: "success",
			labelText: "Showing",
			state: "false", 
			onSwitchChange: _toggleUserSelection
		});
	}
	return 	{
		onload : function() {
			_bindEventHandlers();			
			$(".result").hide();
			$("#header").hide().show("slow");
			$('#form-main').hide().show("slow");
			$("#btn-findgems").fadeTo(800,0.5).fadeTo(800,1.0).fadeTo(800,0.5).fadeTo(800,1.0).fadeTo(800,0.5).fadeTo(800,1.0);
		},
		findGems : function(e) {
			e.preventDefault();
			// Get the userText
			userSelection  = {};
			userSelectionText = [];
			userSelection.id = 'u-id-0';
			userSelection.text = $('#usertext').val();
			userSelectionText.push(userSelection);
			var spinner = new Spinner().spin();
			// Send the userText to backend.
			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: "/findgems",
				data: JSON.stringify(userSelectionText),
				dataType: "json",
				beforeSend: function() {
					$('#form-main').append(spinner.el);
				},
				success: function(response) {
					spinner.stop();
					// Hide the header
					$("#header").hide('slide',{direction: 'left'}, 500, Home.renderGems(response));
					// Hide the Home section
					$('#form-main').hide('slide',{direction: 'left'}, 500, Home.renderGems(response));					
				}
			});
		},
		renderGems : function(gems) {
			$(".result").show('slide',{direction: 'right'}, 500, function(){
				_showDisplaySwitch();
				//Hide the success alert
				$(".alert").fadeOut(3000);
				$('#gems').show("slow");
				$('#gems').html(gems[0].text);
				$('#gems').contents()
					.filter(function(){return this.nodeType === 3})
					.wrap('<span class="not-gem" />');
			});			
		}
	};
})();
$(document).ready(Home.onload);