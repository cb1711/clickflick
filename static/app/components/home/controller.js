angular.module('home').
controller('homeController',function($scope,homeService){

    // Inititate switches
    $scope.state = {
        switch1:true,
        switch2:true,
        switch3:true,
        switch4:true,
    };

    // Ask for switch state from pi using get request
    homeService.inititate().then(
        function(response){
            $scope.state = {
                switch1:response.data.switch1,
                switch2:response.data.switch1,
                switch3:response.data.switch1,
                switch4:response.data.switch1,
            };
        },
        function(err){
            console.log("Error encountered");
        }
    );

    $scope.switchClicked = function(state){
        homeService.flip(state).then(
            function(response){
                $scope.state = {
                    switch1:response.data.data.switch1,
                    switch2:response.data.data.switch2,
                    switch3:response.data.data.switch3,
                    switch4:response.data.data.switch4,
                };
            },
            function(err){
                console.log("Error encountered");
            });
    };
});
