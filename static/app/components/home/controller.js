angular.module('home').
controller('homeController',function($scope,homeService){

    // Inititate switches
    $scope.state = {
        switch1:true,
        switch2:true,
        switch3:true,
        switch4:true,
    };

    // stores the last state of the varible 'state' before flipping switch
    var lastState;

    // Ask for switch state from pi using get request
    homeService.inititate().then(
        function(response){
            $scope.state.switch1=response.data.switch1;
            $scope.state.switch2=response.data.switch2;
            $scope.state.switch3=response.data.switch3;
            $scope.state.switch4=response.data.switch4;

            lastState = JSON.parse(JSON.stringify( $scope.state ));
        },
        function(err){
            console.log("Error encountered");
        }
    );

    homeService.on('init',function(data){
        console.log(data);
        // $scope.state.switch1=data.switch1;
        // $scope.state.switch2=data.switch2;
        // $scope.state.switch3=data.switch3;
        // $scope.state.switch4=data.switch4;
    });

    // Socket object to get data when some other user changes the data
    homeService.on('newState',function(data){
        // console.log(data);
        $scope.state.switch1=data.switch1;
        $scope.state.switch2=data.switch2;
        $scope.state.switch3=data.switch3;
        $scope.state.switch4=data.switch4;
    });

    $scope.switchClicked = function(state){
        homeService.flip(state).then(
            function(response){
                var flag = true;
                // Check if the data has actually changed (if not dont send socket msg to save bandwidth)
                if(lastState.switch1==response.data.switch1 && lastState.switch2==response.data.switch2 && lastState.switch3==response.data.switch3 && lastState.switch4==response.data.switch4){
                    flag = !flag;
                }
                $scope.state.switch1=response.data.switch1;
                $scope.state.switch2=response.data.switch2;
                $scope.state.switch3=response.data.switch3;
                $scope.state.switch4=response.data.switch4;

                lastState = JSON.parse(JSON.stringify( $scope.state ));

                if(flag){
                    console.log("data change postitive");
                    homeService.emit('stateChanged',response.data);
                }

            },
            function(err){
                console.log("Error encountered");
            });
    };
});
