angular.module('home').
service('homeService',function($http){
    var flip = function(data){
        return $http({
			method:'POST',
			url:"http://192.168.1.4:5000/switchFlick",
			data:{data:data},
			})
			.then(function(response){
				return response;
			},
			function(error){
			});
    };

    var inititate = function(){
        return $http.get("http://192.168.1.4:5000/State");
    };

    return {
        flip:flip,
        inititate:inititate
    };
});
