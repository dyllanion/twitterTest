/* register the modules the application depends upon here*/
angular.module('users', []);
angular.module('registration', []);

/* register the application and inject all the necessary dependencies */
var app = angular.module('TwitterApp', ['users', 'registration']);
