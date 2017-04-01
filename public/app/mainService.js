angular.module('scifi-blasphemy')
.factory('mainService', function($http){
	return {
		getOne (tableName, showName, id) {
			return $http.get(`/api/${tableName}/${id}?show=${showName}`)
				.then(response => response.data);
		},

		getList (tableName, showName) {
			return $http.get(`/api/${tableName}?show=${showName}`)
				.then(response => response.data.results);
		},

		patch(tableName, showName, id, body) {
			return $http.patch(`/api/${tableName}/${id}?show=${showName}`, body)
				.then(response => response.data);
		}
	}
});
