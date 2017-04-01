angular.module('scifi-blasphemy')
.controller('personCtrl', function($scope, $stateParams, mainService){
	mainService.getOne('people', $stateParams.show, $stateParams.id)
		.then(person => {
			$scope.person = person
		});

	$scope.updatePerson = function(){
		delete $scope.person.id;
		mainService.patch('people', $stateParams.show, $stateParams.id, $scope.personUpdate)
			.then(updatedPerson => {
				$scope.person = updatedPerson;
			});
	};
});
