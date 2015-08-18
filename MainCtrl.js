(function() {

  var app = angular.module("Ape", ['mp.colorPicker','Halftone']);

  var MainCtrl = function($scope) {
  
  	  $scope.defaults = {
  	  					sample : 5,
  	  					luminosity : "Standard",
  	  					colour1: "#ffffff",
  						colour2: "#000000"
  	  					};
	
	$scope.goOverlay=true;
	/**
	 * Reset the demo form to the default values.
	 *
	 * @return void.
	 */
	 $scope.reset = function(canvasID) {
        $scope.data = angular.copy($scope.defaults);
        $scope.$broadcast('reset', canvasID);
      };
      
	$scope.headerhalftone = function(canvasID) {
	  alert('do demo');
			var options = {
        	'sample' : 3,
        	'bottomright' : [314,227],
        	'luminosity' : "Standard",
        	'zoomfactor' : 0,
		'colour1' : "#ffffff",
        	'colour2' : "#adadad",
		'id' : canvasID
        };
$scope.goOverlay=false;

        $scope.$broadcast('render', options);
      };
 	


      $scope.render = function(canvasID){
 
        if (null !=canvasID)$scope.data.id = canvasID;
        $scope.$broadcast('render', $scope.data);
      
      };

    $scope.reset();
   

  };
  
  app.controller("MainCtrl",MainCtrl);

}());