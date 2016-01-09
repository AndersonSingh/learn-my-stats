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


  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.profile-courses', {
    url: '/profile-courses',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-courses.html',
        controller: 'ProfileCoursesCtrl'
      }
    }
  })

  .state('app.profile-add-course', {
    url: '/profile-add-course?course&grade&startDate',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-add-course.html',
        controller: 'CoursesCtrl'
      }
    }
  })

  .state('app.add-university', {
    url: '/add-university',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-university.html',
        controller: 'HelperCtrl'
      }
    }
  })

  .state('app.add-degree', {
    url: '/add-degree',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-degree.html',
        controller: 'HelperCtrl'
      }
    }
  })

  .state('app.add-course', {
    url: '/add-course',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-course.html',
        controller: 'HelperCtrl'
      }
    }
  })
  ;

  $urlRouterProvider.otherwise('/home');
}])

.controller('AppCtrl', ['$scope', '$state', function($scope, $state){

  $scope.signOut = function(){
    localStorage.removeItem('firebase:session::learn-my-stats');
    $state.go('home');
  };

}])

.controller('HomeCtrl', ['$scope', '$state', function($scope, $state){
  console.log("Launching Home Controller");
  /*
    to do:
    1. write a function to check if already signed in.
    2. write a function to sign out a user.
  */

  $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

  /* user logged in. */
  if($scope.authData !== null){
    $state.go('app.profile');
  }


  /* function to sign the user in via facebook. */
  $scope.signInFB = function(){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com");

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("DEBUG: SIGNIN FAILED.", error);
      }
      else {
        console.log("DEBUG: SIGNIN SUCCESS.", authData);
        $state.go('app.profile');
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
        $state.go('app.profile');
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
    var refUser = new Firebase("https://learn-my-stats.firebaseio.com/profiles/" + $scope.authData.uid);

    var userData = $firebaseObject(refUser);

    /* load the user data for display. */
    userData.$loaded().then(function() {
      $scope.university = userData.university;
      $scope.degree = userData.degree;
      $scope.startDate = new Date(JSON.parse(userData.startDate));
      });



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

    /* save alert. */
    navigator.notification.alert('Profile Information Saved.', function(){}, "Profile");

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

.controller('CoursesCtrl',['$scope', '$stateParams', '$state', '$firebaseObject', function($scope, $stateParams, $state, $firebaseObject){

  $scope.courses = null;
  $scope.authData = null;

  $scope.course = $stateParams.course;
  $scope.grade = null;
  $scope.startDate = null;

  $scope.init = function(){

    /* pass a query parameter to determine if a new course is being added or edited,
      and then load the data in the fields.
     */
     if($scope.course !== undefined) {
       $scope.grade = $stateParams.grade;
       $scope.startDate = new Date(JSON.parse($stateParams.startDate));
     }

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

    if(course === null || grade === null || startDate === null){
      navigator.notification.alert('Error: One or More Fields Left Blank.', function(){}, "Courses");
    }
    else{

      var ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid + "/" + course);
      startDate = JSON.stringify(startDate);

      ref.set({
        "grade" : grade,
        "startDate" : startDate
      });

      navigator.notification.alert('Course Added Successfully To Profile.', function(){}, "Courses");
      $state.go("app.profile-courses");
    }

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

    navigator.notification.alert('University Added Successfully.', function(){}, "University");
    $state.go("app.profile");
  };

  $scope.addDegree = function(degree){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/degrees");

    ref.push({
      "name" : degree
    });

    navigator.notification.alert('Degree Added Successfully.', function(){}, "Degree");
    $state.go("app.profile");
  };

  $scope.addCourse = function(course){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/courses");
    /* since the course code is a unique key, do not need to use push. */
    var obj = {};
    obj[course] = true;
    ref.update(obj);

    navigator.notification.alert('Course Added Successfully.', function(){}, "Course");
    $state.go("app.profile");
  };

}]);
