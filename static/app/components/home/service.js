angular.module('home').
service('homeService',function($http,$q,config){

    var socket = io();

    var flip = function(data){
        return $http({
			method:'POST',
			url:config.apiURL+"/switchFlick",
			data:{data:data},
			})
			.then(function(response){
				return response;
			},
			function(error){
			});
    };

    // var inititate = function(){
    //     return $http.get("http://127.0.0.1:5000/State");
    // };

    var on = function(event,callback){
        socket.on(event,callback);
    };

    var emit = function(event,data){
        socket.emit(event,data);
    };

    return {
        flip:flip,
        // inititate:inititate,
        on:on,
        emit:emit
    };
});
