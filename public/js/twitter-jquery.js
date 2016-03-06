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
//			$(".top-padd").stop().animate({
//				'height': '80px'
//			});
			
			$(".header_bg p").fadeOut();
			
			
		}else{
			$(".header_bg").stop().animate({
				'height': '210px'
			});
			$(".header_bg h2").stop().animate({
				'margin-top': '5px'
			});
//			$(".top-padd").stop().animate({
//				'height': '210px'
//			});
			
			$(".header_bg p").fadeIn();
			
			
		}
	});
});