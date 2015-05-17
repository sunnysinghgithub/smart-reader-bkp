var Home = (function() {
	return 	{
		onload : function() {
			$('#form-main').submit(Home.findgems);
		},

		findgems : function(e) {
			e.preventDefault();
			// Get the usertext
			var usertext  = {};
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
			$('#form-main').hide();
		}
	};
})();

$(document).ready(Home.onload);