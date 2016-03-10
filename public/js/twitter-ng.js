var app = angular.module("twitter",[]);

app.controller("twitter",function($scope, $http){
	$scope.logout = function(){
		$http({
			method: 'POST',
			url: '/logout',
		}).then(function suc(val){
			if(val.data == "done"){
				window.location.reload();
			}
		});
	}
});