angular.module('home').
service('homeService',function($http){
    var flip = function(data){
        return $http({
			method:'POST',
			url:"http://127.0.0.1:5000/switchFlick",
			data:{data:data},
			})
			.then(function(response){
				return response;
			},
			function(error){
			});
    };

    var inititate = function(){
        return $http.get("http://127.0.0.1:5000/State");
    };

    return {
        flip:flip,
        inititate:inititate
    };
});
