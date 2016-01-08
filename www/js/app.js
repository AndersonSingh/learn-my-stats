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
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileCtrl'
  })

  .state('profile-courses', {
    url: '/profile-courses',
    templateUrl: 'templates/profile-courses.html',
    controller: 'ProfileCoursesCtrl'
  })

  .state('profile-add-course', {
    url: '/profile-add-course',
    templateUrl: 'templates/profile-add-course.html',
    controller: 'CoursesCtrl'
  })

  .state('add-university', {
    url: '/add-university',
    templateUrl: 'templates/add-university.html',
    controller: 'HelperCtrl'
  })

  .state('add-degree', {
    url: '/add-degree',
    templateUrl: 'templates/add-degree.html',
    controller: 'HelperCtrl'
  })

  .state('add-course', {
    url: '/add-course',
    templateUrl: 'templates/add-course.html',
    controller: 'HelperCtrl'
  })
  ;

  $urlRouterProvider.otherwise('/home');
}])

.controller('HomeCtrl', ['$scope', '$state', function($scope, $state){

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
        $state.go('profile');
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
        $state.go('profile');
      }
    });
  };

}])

.controller('ProfileCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject){

  $scope.authData = null;

  $scope.universities = null;
  $scope.degrees = null;

  $scope.university = null;
  $scope.degree = null;
  $scope.startDate = null;

  $scope.init = function(){

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    if($scope.authData == null) {
        /* display error indicating user is not logged in. */
    }
    else {
      /* do a check to ensure session has not expired. */

    }

    /* this will retrieve the list of universities from firebase. */
    var refUniversities = new Firebase("https://learn-my-stats.firebaseio.com/universities");
    $scope.universities = $firebaseObject(refUniversities);

    /* this will retrieve the list of degrees from firebase */
    var refDegrees = new Firebase("https://learn-my-stats.firebaseio.com/degrees");
    $scope.degrees = $firebaseObject(refDegrees);

    /* need to retrieve university, degree, startDate from firebase if already set. */

  };

  /* this function will save profile data to firebase. */
  $scope.save = function(university, degree, startDate){

    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profiles/" + $scope.authData.uid);


    startDate = JSON.stringify(startDate);

    ref.update({
      'name' : $scope.authData[$scope.authData.provider].displayName,
      'university' : university,
      'degree' : degree,
      'startDate' : startDate
    });
  };


}])

.controller('ProfileCoursesCtrl',['$scope', '$firebaseObject', function($scope, $firebaseObject){

  $scope.courses = null;

  $scope.init = function(){

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    if($scope.authData == null) {

    }
    else {

    }

    /* pull all courses this user has done with grade details. */
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid);
    $scope.courses = $firebaseObject(ref);
  };

}])

.controller('CoursesCtrl',['$scope', '$firebaseObject', function($scope, $firebaseObject){

  $scope.courses = null;
  $scope.authData = null;

  $scope.init = function(){

    /* pass a query parameter to determine if a new course is being added or edited,
      and then load the data in the fields.
     */

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    /* this will retrieve the list of courses from firebase */
    var refCourses = new Firebase("https://learn-my-stats.firebaseio.com/courses");
    $scope.courses = $firebaseObject(refCourses);

    /* this will retrieve the list of grades from firebase */
    var refGrades = new Firebase("https://learn-my-stats.firebaseio.com/grades");
    $scope.grades = $firebaseObject(refGrades);

  };

  /* saves a course to a user profile. */
  $scope.save = function(course, grade, startDate){

    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid + "/" + course);
    startDate = JSON.stringify(startDate);

    ref.set({
      "grade" : grade,
      "startDate" : startDate
    });

  };

}])

.controller('HelperCtrl',['$scope', function($scope){

  $scope.university = "The University of the West Indies";
  $scope.degree = "BSc. Computer Science";
  $scope.course = "COMP2000";

  $scope.addUniversity = function(university){

    var ref = new Firebase("https://learn-my-stats.firebaseio.com/universities");

    ref.push({
      "name" : university
    });

  };

  $scope.addDegree = function(degree){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/degrees");

    ref.push({
      "name" : degree
    });

  };

  $scope.addCourse = function(course){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/courses");
    /* since the course code is a unique key, do not need to use push. */
    var obj = {};
    obj[course] = true;
    ref.update(obj);
  };

}]);
