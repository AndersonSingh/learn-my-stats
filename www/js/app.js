// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  });

  $urlRouterProvider.otherwise('/home');
}])

.controller('HomeCtrl',['$scope', function($scope){

  /*
    to do:
    1. write a function to check if already signed in.
    2. write a function to sign out a user.
  */

  /* function to sign the user in via facebook. */
  $scope.signInFB = function(){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com");

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("DEBUG: SIGNIN FAILED.", error);
      }
      else {
        console.log("DEBUG: SIGNIN SUCCESS.", authData);
      }
    });
  };

  /* function to sign the user in via google. */
  $scope.signInGoogle = function(){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com");

    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("DEBUG: SIGNIN FAILED.", error);
      }
      else {
        console.log("DEBUG: SIGNIN SUCCESS.", authData);
      }
    });
  };

}]);
