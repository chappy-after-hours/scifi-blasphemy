angular.module('scifi-blasphemy', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
	.state('peopleships', {
		url: '/peopleships',
		templateUrl: 'app/peopleships/peopleships.html',
		controller: 'peopleshipsCtrl'
	})
	.state('person', {
		url: '/person/:id?show',
		templateUrl: 'app/person/person.html',
		controller: 'personCtrl'
	});

	$urlRouterProvider.otherwise('/');
});
