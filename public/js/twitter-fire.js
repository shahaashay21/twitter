$(document).ready(function(e){
	// FORM REGISTRATION QUERY
	$('.regForm').submit(function(e){
		e.preventDefault();
		
		var data = $('.regForm').serializeArray();
		$.ajax({
			type: "POST",
			url: '/reg',
			dataType: 'json',
			data: data,
			cache: false,
			beforeSend:function(){
				$('.regAjaxLoading').show();
			},
			success:function(response){
				//consoleClear();
				console.log(response);
				$('.regAjaxLoading').hide();
				
				if(response == 'Registered')
				{
					$('.emailregistered').css('visibility','hidden');
					$('#register-modal').modal('hide');
					alertline('alert-notify-success','<b>Successfully Registered.</b> Now you can LOGIN');
				}else if(response == 'Network Problem')
				{
					$('.emailregistered').css('visibility','hidden');
					$('.register-modal').modal('hide');
					alertline('.alert-notify-info','<b>Network Problem.</b> Please try again.');
				}
				if(response == 'available'){
//					var email = response.email.join();
					// console.log(email);
					$('.emailregistered').css('visibility','visible');
					$("#email").removeClass('inputsuc');
					$("#email").addClass('inputerr');
					$(".email-glyphicon").removeClass('glyphicon-ok');
					$(".email-glyphicon").addClass('glyphicon-remove');
					$(".email-glyphicon").css('color','#a94442');
					$(".email-glyphicon").show();
				}
				
//				$(".inputfield").removeClass("inputerr");
//				$(".ff-text-danger").remove();
//				$.each(response["message"], function(i,item){
//					$("#"+i).addClass("inputerr");
//					$("#"+i).after("<div class=\'col-xs-12 ff-text-danger\'>"+item+"</div>");
//				});
			}
		});
	});

	// LOGIN FORM QUERY
	$(".loginForm").submit(function(e){
		e.preventDefault();

		var data = $('.loginForm').serializeArray();

		$.ajax({
			type: "POST",
			url: "/login",
			dataType: "json",
			data: data,
			cache: false,
			beforeSend:function(){
				$('.regAjaxLoading').show();
				$(".wrong-cred").hide();
			},
			success:function(response){
				$('.regAjaxLoading').hide();
				if(response['modal'] == 0){
					$("#login-modal").modal('hide');
				}
				if(response['alert'] == 1){
					alertline(response['alerttype'],response['message']);
				}
				if(response == "fail"){
					$(".wrong-cred").show();
				}
				else{
					var url = $(location).attr('href');
					window.location=url;
				}
			}
		});
	});
	
	// LOGIN FORM QUERY
	$(".loginForm1").submit(function(e){
		e.preventDefault();

		var data = $('.loginForm1').serializeArray();

		$.ajax({
			type: "POST",
			url: "/login",
			dataType: "json",
			data: data,
			cache: false,
			beforeSend:function(){
				$('.regAjaxLoading').show();
				$(".wrong-cred1").hide();
			},
			success:function(response){
				$('.regAjaxLoading').hide();
				if(response['modal'] == 0){
					$("#login-modal").modal('hide');
				}
				if(response['alert'] == 1){
					alertline(response['alerttype'],response['message']);
				}
				if(response == "fail"){
					$(".wrong-cred1").show();
				}
				if(response == "pass"){
					var url = $(location).attr('href');
					window.location=url;
				}
			}
		});
	});
});