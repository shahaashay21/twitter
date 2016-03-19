var app = angular.module("twitter",[]);

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

app.controller("twitterhash",function($scope, $http){

//	$scope.hashtag = function(){
//		$http({
//		});
//	}
//	angular.element('.center-home').hide();
//	$scope.hashtag();
});

app.controller("twitter",function($scope, $http, $location){
	//LOGOUT USER
	$scope.logout = function(){
		$http({
			method: 'POST',
			url: '/logout',
		}).then(function suc(val){
			if(val.data == "done"){
				window.location.reload();
			}
		});
	};
	$scope.tweetchar = function(){
		if($scope.tweet.length == 0 || $scope.tweet.length > 140){
			angular.element(".tweetsubmitbtn").addClass("disabled");
		}else{
			angular.element(".tweetsubmitbtn").removeClass("disabled");
		}
	};
	//SUBMIT TWEET
	$scope.tweetsubmit = function(){
		if($scope.tweet.length > 0 && $scope.tweet.length <= 140){
			data = {'tweet': $scope.tweet};
			$http({
				method: 'POST',
				url: '/tweet',
				dataType: "json",
				data: data
			}).then(function suc(val){
				if(val){
					angular.element("#tweetbox").modal('hide');
					alertline("alert-notify-success","<b>Tweet has been posted</b>");
					angular.element(".stylish-input-group2").hide();
					angular.element(".stylish-input-group1").show();
					angular.element(".center-home .top").css('height', '55px');
					$scope.tweet = "";
					$scope.recenttweet();
					$scope.totalTweet += 1;
				}
				
			});
		}else{
			angular.element("#tweetbox").modal('hide');
			alertline("alert-notify-danger","<b>Tweet must have less than 140 character</b>");
		}
	};
	//GET RECENT TWEET
	$scope.recenttweet = function(){
		if(window.hashSearch){
			$scope.orm = 0;
			var url = "/hashtweet";
			var data = {'q': window.hashSearch}; 
		}else if(window.userid){
			$scope.orm = 0;
			var url = "/tweetbyuserid";
			var data = {'q': window.userid};
		}else{
			$scope.orm = 0;
			var url = "/recenttweet";
			var data = {'q': ""};
		}
			$http({
			method: 'POST',
			url: url,
			data: data,
			dataType: 'json'
		}).then(function(data){
//			console.log(data.data);
//			console.log(data.data.likes);
//			$scope.tweetlike = data.data.likes;
//			$scope.likeval = data.data.likes;
			if($scope.orm == 1){
				$scope.tweets = data.data.da;
			}else{
				$scope.tweets = data.data.da[0];
			}
//			console.log($scope.tweets);
//			console.log($scope.tweetlike);
			$scope.user = data.data.user;
			for(var i=0; i<$scope.tweets.length; i++){// Give all object of tweet
//				console.log($scope.tweets[i].tweet);
				var hashtag = [];
				var hashWithSpace = $scope.tweets[i].tweet.match(/(^#\w+| #\w+| #\w+)/g);
				if(hashWithSpace){
					hashWithSpace = hashWithSpace.getUnique(true);
					for(var j=0; j<hashWithSpace.length; j++){// Get hastag from tweet
						hashtag[j] = hashWithSpace[j].trim();
						$scope.tweets[i].tweet = $scope.tweets[i].tweet.replace(new RegExp(hashtag[j],'g'),"<a href='/hashtag/"+hashtag[j].substring(1)+"'>"+hashtag[j]+"<a/>");
					}
				}
				$scope.tweets[i].newdate = new Date($scope.tweets[i].createdAt); 
				$scope.tweets[i].nowdate = new Date();
				$scope.tweets[i].difference = parseInt($scope.tweets[i].nowdate - $scope.tweets[i].newdate); 
				var seconds = parseInt(($scope.tweets[i].difference)/1000);
				var minutes = parseInt(seconds/60);
				var hrs = parseInt(minutes/60);
				var days = parseInt(hrs/24);
				var months = parseInt(hrs/30);
				if(seconds > 60){
					if(minutes > 60){
						if(hrs > 24){
							if(days > 30){
								var time = months+"m";
							}else{
								var time = days+"d"; 
							}
						}else{
							var time = hrs+"h"; 
						}
					}else{
						var time = minutes+"m"; 
					}
				}else{
					var time = seconds+"s"; 
				}
				$scope.tweets[i].time = time;
			}
	//		console.log($scope.tweets);	
		});
	}
	//DELETE TWEET
	$scope.deleteTweet = function(id){
		console.log(id);
		data = {'id': id};
		$http({
			method: 'POST',
			dataType: 'json',
			url: '/deletetweet',
			data: data
		}).then(function success(res){
			$scope.recenttweet();
			$scope.totalTweet -= 1;
		});
	};
	

	//GET SEARCH SUGGESTION MADE BY ME
	var tempcheck = "";
	$scope.q ="";
	$scope.search = function(opt){
		var hashtag = 0;
		var handle = 0;
		if(opt == "focus"){
			tempcheck = "";
		}
		if($scope.q != tempcheck){
			var data = {'q': $scope.q};
			if($scope.q.charAt(0) == '#'){
				hashtag = 1;
			}else if($scope.q.charAt(0) == '@'){
				handle= 1;
			}
			$http({
				method: 'POST',
				dataType: 'json',
				url: '/suggest',
				data: data
			}).then(function success(res){
				if(hashtag == 1){
					$scope.availableTagsHashtag = res.data;
					angular.element('.for-drop').css("display","none");
					angular.element('.for-drop-hashtag').css("display","table");
				}else if(handle == 1){
					$scope.availableTags = res.data;
					angular.element('.for-drop').css("display","table");
				}else{
					$scope.availableTags = res.data;
					angular.element('.for-drop-hashtag').css("display","none");
					angular.element('.for-drop').css("display","table");
				}
				angular.element('.dropdown-toggle').dropdown();
				angular.element('.dropdown-toggle').css("display","table");
				tempcheck = $scope.q;
			});
			
		}
	};
	
	//REDIRECT TO USER PROFILE PAGE
	$scope.userRedirect= function(id){
		window.location.assign("/user/"+id);
	};
	
	//REDIRECT TO HASHTAG SEARCH
	$scope.hashtagRedirect = function(hashtag){
		window.location.assign("/hashtag/"+hashtag);
	}
	
	
	$scope.like = function(id,userlike,index){
		data = {'id': id};
//		console.log(index);
		$http({
			method: 'POST',
			url: '/like',
			data: data,
			dataType: 'json'
		}).then(function suc(reslike){
			if(reslike.data == true){
				$scope.tweets[index].tweetlikes = Number($scope.tweets[index].tweetlikes) + 1;
				$scope.tweets[index].userlike = 1;
			}
			if(reslike.data == false){
				$scope.tweets[index].tweetlikes = Number($scope.tweets[index].tweetlikes) - 1;
				$scope.tweets[index].userlike = 0;
			}
		});
	}
	
	//GET UNIQUE ARRAY
	Array.prototype.getUnique = function (createArray) {
        createArray = createArray === true ? true : false;
        var temp = JSON.stringify(this);
        temp = JSON.parse(temp);
        if (createArray) {
            var unique = temp.filter(function (elem, pos) {
                return temp.indexOf(elem) == pos;
            }.bind(this));
            return unique;
        }
        else {
            var unique = this.filter(function (elem, pos) {
                return this.indexOf(elem) == pos;
            }.bind(this));
            this.length = 0;
            this.splice(0, 0, unique);
        }
    }
	
	
	//CALL DEFAULT WHEN PAGE LOAD
	$scope.recenttweet();
});

// DIRECTIVE MADE IN ORDER TO APPLY JQUERY AFTER NG-REPEAT TAG
app.directive('searchRepeatDirective', function() {
	  return function(scope, element, attrs) {
		  element.hover(function (){
			  angular.element(this).find('.suggest-name').css("color","#fff");
			  angular.element(this).find('.suggest-handle').css("color","#fff");
			  angular.element(this).find('.suggest-hashtag').css("color","#fff");
		  },function () {
			  angular.element(this).find('.suggest-name').css("color","#292f33");
			  angular.element(this).find('.suggest-handle').css("color","#8899a6");
			  angular.element(this).find('.suggest-hashtag').css("color","#66757f");
		  });
	  };
})