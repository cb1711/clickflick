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
            $scope.state.switch1=response.data.switch1;
            $scope.state.switch2=response.data.switch2;
            $scope.state.switch3=response.data.switch3;
            $scope.state.switch4=response.data.switch4;
        },
        function(err){
            console.log("Error encountered");
        }
    );

    homeService.on('stateChanged',function(data){
        console.log(data);
    });

    $scope.switchClicked = function(state){
        homeService.flip(state).then(
            function(response){
                // var flag = true;
                // if($scope.state.switch1==response.data.switch1 && $scope.state.switch2==response.data.switch2 && $scope.state.switch3==response.data.switch3 && $scope.state.switch4==response.data.switch4){
                //     flag = !flag;
                // }
                $scope.state.switch1=response.data.switch1;
                $scope.state.switch2=response.data.switch2;
                $scope.state.switch3=response.data.switch3;
                $scope.state.switch4=response.data.switch4;

                homeService.emit('stateChanged',response.data);
                // if(flag){
                //     console.log($scope.state);
                //     homeService.emit('stateChanged',response.data);
                // }

            },
            function(err){
                console.log("Error encountered");
            });
    };
});
