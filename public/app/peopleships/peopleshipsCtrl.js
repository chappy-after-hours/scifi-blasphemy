angular.module('scifi-blasphemy')
.controller('peopleshipsCtrl', function($scope, mainService){
	$scope.mash = function(){
		mainService.getList('people', 'startrek')
			.then(peoplelist => {
				let randomIndex = Math.floor(Math.random() * peoplelist.length);
				$scope.person = peoplelist[randomIndex];
			});
		mainService.getList('ships', 'starwars')
			.then(shipslist => {
				let randomIndex = Math.floor(Math.random() * shipslist.length);
				$scope.ship = shipslist[randomIndex];
			});
	};
});
