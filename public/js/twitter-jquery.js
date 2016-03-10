$(document).ready(function(e){
	
	$(window).scroll(function(){
		//console.log($(this).scrollTop());
		if($(this).scrollTop() > 1){
			$(".header_bg h2").stop().animate({
				'margin-top': '-35px'
			});
			$(".header_bg").stop().animate({
				'height': '80px'
			});
			
			$(".header_bg p").fadeOut();
			
			
		}else{
			$(".header_bg").stop().animate({
				'height': '210px'
			});
			$(".header_bg h2").stop().animate({
				'margin-top': '5px'
			});
			
			$(".header_bg p").fadeIn();
			
			
		}
	});
	
	// REGISTER VALIDATION
	$('#fname').on('keyup click focus blur change', function(){
		nullFieldValidation('fname');
	});

	$('#pass').on('keyup click focus blur change', function(){
		nullFieldValidation('pass');
	});

	$('#lname').on('keyup click focus blur change', function(){
		nullFieldValidation('lname');
	});

	$('#email').on('keyup click focus blur change', function(){
		nullFieldValidation('email');
	});
	
	//LOGIN VALIDATION
	$('#email-login').on('keyup click focus blur change', function(){
		nullFieldValidation('email-login');
	});
	$('#pass-login').on('keyup click focus blur change', function(){
		nullFieldValidation('pass-login');
	});
	
});

//CHECK BEFOR LOGIN
function loginSubmit(){
	if( ($("#email-login").hasClass('inputsuc') && $("#pass-login").hasClass('inputsuc'))){
		return true;
	}else{
		nullFieldValidation('email-login');
		nullFieldValidation('pass-login');
		return false;
	}
}

//CHECK BEFORE REGISTER
function registerSubmit(){
//	 console.log('reg-submit');
	var err = 0;
	if($('#fname').hasClass('inputsuc') && $('#lname').hasClass('inputsuc') && $('#email').hasClass('inputsuc') && $('#pass').hasClass('inputsuc')){
		return true;
	}else{
		nullFieldValidation('fname');
		nullFieldValidation('lname');
		nullFieldValidation('pass');
		nullFieldValidation('email');
		return false;
	}
}

/* REGISTER VALIDATION*/
//CHECK NULL FIELD
function nullFieldValidation(id){
	var idname = '#'+id;
	var idvalue = $(idname).val();
	var err = 0;
	var glyphicon = '.'+id+'-glyphicon';
	// console.log(glyphicon);

	// FOR PASSWORD MIN LENGTH 6
	if(id == 'pass' || id == 'pass-reset-form'){
		if(idvalue.length < 6){
			// if(id == 'pass-login'){
				$(idname).css('margin-bottom','0px');
			// }
			$('.min6char').show();
			err = 1;
		}else{
			// if(id == 'pass-login'){
				$(idname).css('margin-bottom','20px');
			// }
			$('.min6char').hide();
			err = 0;
		}
	}
	// END


	// VALIDATING EMAIL ID
	if(id == 'email' || id == 'email-login' || id == 'email-reset' || id == 'email-reset-form' || id == 'email-login1'){
		var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
		if (reg.test(idvalue)){
			err = 0;
		}
		else{
			err = 1;
		}
	}

	if(id == 'conf-pass-reset-form'){
		var passvalue = $('#pass-reset-form').val();
		if(idvalue == passvalue){
			err = 0;
		}else{
			err = 1;
		}
	}

	// IF ANY ERROR
	if(idvalue == null || idvalue == '' || err == 1){
		$(idname).removeClass('inputsuc');
		$(idname).addClass('inputerr');
		$(glyphicon).removeClass('glyphicon-ok');
		$(glyphicon).addClass('glyphicon-remove');
		$(glyphicon).css('color','#a94442');
		$(glyphicon).show();
	}else{
		$(idname).removeClass('inputerr');
		$(idname).addClass('inputsuc');
		$(glyphicon).removeClass('glyphicon-remove');
		$(glyphicon).addClass('glyphicon-ok');
		$(glyphicon).css('color','#3c763d');
		$(glyphicon).show();
	}
}


// VALIDATE EMAIL ID
function validateEmail(email)
{
	var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	if (reg.test(email)){
	return true; }
	else{
	return false;
	}
}


//ALERT LINE
function alertline(mood,message){
	//$('.alert-top-notify').slideUp(0);
	$('.alert-top-notify').removeClass('alert-notify-success alert-notify-info alert-notify-warning alert-notify-danger');
	$('.alert-top-notify').addClass(mood);
	// console.log(message);
	var messageshow = "<center><span>"+message+"</span></center>";
	// $(messageshow).appendTo('.alert-top-notify');
	$('.alert-top-notify').html(messageshow);
	// $('.alert-top-notify').show('slide',{ direction : "up"});
//	console.log($('.alert-top-notify').is(':visible'));
	if($('.alert-top-notify').is(':visible')){

	}else{
		$('.alert-top-notify').slideDown();
	}
	// hidealert();
	setTimeout(function(){$('.alert-top-notify').slideUp();},5000);

	function hidealert(){
		// setTimeout(function(){$('.alert-top-notify').slideUp();},5000);
	}
}