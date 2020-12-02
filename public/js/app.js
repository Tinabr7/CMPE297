// See LICENSE.MD for license information.

var app = angular.module('MEANapp', ['ngRoute', 'ngStorage']);


/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $localStorage, $sessionStorage, $location, $http){

    // Set local scope to persisted user data
    $scope.user = $localStorage;
    // console.log("scope");
  //   console.log($scope);

    // Logout function
    $scope.logout = function(){
        $http({
            method: 'GET',
            url: '/account/logout'
        })
            .success(function(response){
                alert(response);
                $localStorage.$reset();
                $location.path('/');
            })
            .error(function(response){
                alert(response);
                $location.path('/account/login');
            });

    }
});


app.controller('adminController', function($scope, $localStorage, $sessionStorage,$http, $filter){


  $http({
      method: 'GET',
      url: '/dash/home'
  })
      .success(function(response){
          $scope.message = response;

          // init
          $scope.sort = {
              sortingOrder : 'Submitter',
              reverse : false
                };

          $scope.gap = 1;

          // num_pages = Math.ceil($scope.message.length/$scope.itemsPerPage);
          // if(num_pages < $scope.gap){
          //     $scope.gap = num_pages;
          // }

          $scope.filteredItems = [];
          $scope.groupedItems = [];
          $scope.itemsPerPage = 5;
          $scope.pagedItems = [];
          $scope.currentPage = 0;
          $scope.items = $scope.message;




          var searchMatch = function (haystack, needle) {
              if (!needle) {
                  return true;
              }
              return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
          };

          // init the filtered items
          $scope.search = function () {
              $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                  for(var attr in item) {
                      if (searchMatch(item[attr], $scope.query))
                          return true;
                  }
                  return false;
              });
              // take care of the sorting order
              if ($scope.sort.sortingOrder !== '') {
                  $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
              }
              $scope.currentPage = 0;
              // now group by pages
              $scope.groupToPages();
          };


          // calculate page in place
          $scope.groupToPages = function () {
              $scope.pagedItems = [];

              for (var i = 0; i < $scope.filteredItems.length; i++) {
                  if (i % $scope.itemsPerPage === 0) {
                      $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                  } else {
                      $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                  }
              }
          };

          $scope.range = function (size,start, end) {
              var ret = [];
              console.log(size,start, end);

              if (size < end) {
                  end = size;
                  start = size-$scope.gap;
              }
              for (var i = start; i < end; i++) {
                  ret.push(i);
              }
              console.log(ret);
              return ret;
          };

          $scope.prevPage = function () {
              if ($scope.currentPage > 0) {
                  $scope.currentPage--;
              }
          };

          $scope.nextPage = function () {
              if ($scope.currentPage < $scope.pagedItems.length - 1) {
                  $scope.currentPage++;
              }
          };

          $scope.setPage = function () {
              $scope.currentPage = this.n;
          };

          // functions have been describe process the data for display
          $scope.search();

      })

      .error(function(response){
          alert(response);
          $location.path('/account/login');
      });

});

app.directive("customSort", function( $scope) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            order: '=',
            sort: '='
        },
        template :
        ' <a ng-click="sort_by(order)" style="color: #555555;">'+
        '    <span ng-transclude></span>'+
        '    <i ng-class="selectedCls(order)"></i>'+
        '</a>',
        link: function(scope) {

            // change sorting order
            $scope.sort_by = function(newSortingOrder) {
                var sort = $scope.sort;

                if (sort.sortingOrder == newSortingOrder){
                    sort.reverse = !sort.reverse;
                }

                sort.sortingOrder = newSortingOrder;
            };


            $scope.selectedCls = function(column) {
                if(column == $scope.sort.sortingOrder){
                    return ('icon-chevron-' + (($scope.sort.reverse) ? 'down' : 'up'));
                }
                else{
                    return'icon-sort'
                }
            };
        }// end link
    }




});




app.controller('SearchController', function($scope, $localStorage, $sessionStorage,$http,$location){

  $scope.user = $localStorage;
  //console.log("inside search controller");
//  console.log($scope.user);
  // console.log("scope user");
//  console.log("title");
  //console.log($scope.SubmitSearchForm1.searchtitle);
  // console.log("scope submit form");
  // console.log($scope.submitForm);

//console.log("temp title:",temptitle);
  $scope.submitTitle = function(){
console.log("title to search:",$scope.SubmitSearchForm1.searchtitle);
var temptitle=$scope.SubmitSearchForm1.searchtitle;
  $http({
      method: 'GET',
      url: '/account/search/'+ temptitle

  })
  .success(function(response){
    if (response==null){

      alert("project not found");
    }
    else{
      $scope.message = response;
      $location.path('/account/search');
    }
    //  console.log('found projects');
      //console.log(response);
  })
  .error(function(response){
      alert(response);
      $location.path('/');
  }
);



}
});

//VoteSubmitController

app.controller('VoteSubmitController', function($scope, $location, $http,$localStorage,$routeParams){

  id=$routeParams.id
  //console.log("routeparams");
  //console.log(id)

    $http({
        method: 'GET',
        url: '/dash/home/'+id
    })
        .success(function(response){
            $scope.message = response;

          //  console.log('found projects');
            //console.log(response);
        })
        .error(function(response){
            alert(response);
            $location.path('/account/login');
        });

$scope.submitVote=function(){
console.log("inside VoteSubmitController:");
console.log("id:",$scope.message._id);
$http({
    method: 'POST',
    url: '/dash/project/',

    data:{
      'id':$scope.message._id,
      'vote':1

    }
})
    .success(function(response){
        $scope.message = response;
     alert("Rating Submitted successfully");
     $location.path('/dash/project')
      //  console.log('found projects');
        //console.log(response);
    })
    .error(function(response){
        alert(response);
        $location.path('/account/login');
    });


}


});


app.controller('ProjectController', function($scope, $location, $http,$localStorage,$routeParams){
$scope.user = $localStorage
id=$routeParams.id
console.log("inside ProjectController");
//console.log(id)

  $http({
      method: 'GET',
      url: '/dash/home/'+id
  })
      .success(function(response){
          $scope.message = response;

        //  console.log('found projects');
          //console.log(response);
      })
      .error(function(response){
          alert(response);
          $location.path('/account/login');
      }
  );
$scope.test=function(){

  console.log("inside test")
}
  $scope.submitFeedback = function(){

  //console.log("submitter:",$scope.SubmitForm1.submitter);
  console.log('inside submit feedback');
  //console.log($scope);

          // Login request
          $http({
              method: 'POST',
              url: '/account/feedback',
              data: {

                'id': id,
                'status':$scope.Submitfeedback1.status,
                'feedback':$scope.Submitfeedback1.feedback
                  }
              })
              .success(function(response){
                  // $localStorage persists data in browser's local storage (prevents data loss on page refresh)
                  //$localStorage.status = true;
                  //$localStorage.user = response;
                  //console.log($localStorage);
                  //console.log($location);
                  alert('feedback added successfully');
                  $location.path('account/admin');
              })
              .error(function(){
                  alert('Error, unable to add feedback');
                  $location.path('account/admin');
              }
          );




  }



});



app.controller('VoteController',function($scope, $localStorage, $http, $sessionStorage, $location,$filter){

  $http({
      method: 'GET',
      url: '/dash/home'
  })
      .success(function(response){
          $scope.message = response;
          console.log("response from VoteController",response);

  //<<<<<<< HEAD
        //  console.log($scope.message[0]._id)
        //  console.log('found projects');
  //=======
          console.log($scope.message[0]._id)

          $scope.sort = {
              sortingOrder : 'Submitter',
              reverse : false
          };

          // init

          $scope.gap = 1;

          $scope.filteredItems = [];
          $scope.groupedItems = [];
          $scope.itemsPerPage = 5;
          $scope.pagedItems = [];
          $scope.currentPage = 0;
          $scope.items = $scope.message;


          var searchMatch = function (haystack, needle) {
              if (!needle) {
                  return true;
              }
              return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
          };

          // init the filtered items
          $scope.search = function () {
              $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                  for(var attr in item) {
                      if (searchMatch(item[attr], $scope.query))
                          return true;
                  }
                  return false;
              });
              // take care of the sorting order
              if ($scope.sort.sortingOrder !== '') {
                  $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
              }
              $scope.currentPage = 0;
              // now group by pages
              $scope.groupToPages();
          };


          // calculate page in place
          $scope.groupToPages = function () {
              $scope.pagedItems = [];

              for (var i = 0; i < $scope.filteredItems.length; i++) {
                  if (i % $scope.itemsPerPage === 0) {
                      $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
                  } else {
                      $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                  }
              }
          };

          $scope.range = function (size,start, end) {
              var ret = [];
              console.log(size,start, end);

              if (size < end) {
                  end = size;
                  start = size-$scope.gap;
              }
              for (var i = start; i < end; i++) {
                  ret.push(i);
              }
              console.log(ret);
              return ret;
          };

          $scope.prevPage = function () {
              if ($scope.currentPage > 0) {
                  $scope.currentPage--;
              }
          };

          $scope.nextPage = function () {
              if ($scope.currentPage < $scope.pagedItems.length - 1) {
                  $scope.currentPage++;
              }
          };

          $scope.setPage = function () {
              $scope.currentPage = this.n;
          };

          // functions have been describe process the data for display
          $scope.search();

          //  console.log('found projects');
  //>>>>>>> 76eb2f7784487a8ff8948a410f189315a1dbb183
          //console.log(response);
      })
      .error(function(response){
          alert(response);
          $location.path('/account/login');
      });


});





app.controller('submitController',function($scope, $localStorage, $http, $sessionStorage, $location){
  // console.log("inside submit controller");
  $scope.user = $localStorage;
  console.log("score for submit:",$scope.user)
  // console.log("scope user");
// console.log($scope.user.user.username);
  // console.log("scope submit form");
  // console.log($scope.submitForm);

$scope.submitRegister = function(){

console.log("submitter:",$scope.SubmitForm1.submitter);
//console.log('inside controller');
//console.log($scope);

        // Login request
        $http({
            method: 'POST',
            url: '/account/submit',
            data: {

              'username': $scope.user.user.username,
              'submitter':$scope.SubmitForm1.submitter,
              'CoSubmitters':$scope.SubmitForm1.cosubmitter,
              'InnovationTitle':$scope.SubmitForm1.InnovationTitle,
              'description':$scope.SubmitForm1.description,
            //  'product':$scope.SubmitForm1.product,
              'gitlink':$scope.SubmitForm1.gitlink,
              'component':$scope.SubmitForm1.component,
              'os':$scope.SubmitForm1.os
                }
            })
            .success(function(response){
                // $localStorage persists data in browser's local storage (prevents data loss on page refresh)
                //$localStorage.status = true;
                //$localStorage.user = response;
                //console.log($localStorage);
                //console.log($location);
                alert('Project added successfully.');
                $location.path('/');
            })
            .error(function(){
                alert('Error, unable to add project');
            }
        );




}





});

app.controller('LoginController', function($scope, $localStorage, $sessionStorage, $location, $http){

    // Login submission
    $scope.submitLogin = function(){

      //  console.log($scope);

        // Login request
        $http({
            method: 'POST',
            url: '/account/login',
            data: {
                    'username': $scope.loginForm.username,
                    'password': $scope.loginForm.password
                }
            })
            .success(function(response){
                // $localStorage persists data in browser's local storage (prevents data loss on page refresh)
                $localStorage.status = true;
                $localStorage.user = response;
                console.log("type");
                console.log(typeof response.username);
                console.log("logged in user:",response.username);
                console.log("condition", response.username=="admin");
                if(response.username=="admin"){
                  $location.path('/account/admin');
                }
                else{

                  $location.path('/');
                }

            })
            .error(function(){
                alert('Login failed. Check username/password and try again.');
            }
        );
    };

    // Redirect to account creation page
    $scope.createAccount = function(){
        $location.path('/account/create');
    }
});

app.controller('CreateAccountController', function($scope, $localStorage, $sessionStorage, $http, $location){

    // Create account
    $scope.submitForm = function(){
        $http({
            method: 'POST',
            url: '/account/create',
            data: {
                    'username': $scope.newUser.username,
                    'password': $scope.newUser.password,
                    'name' : $scope.newUser.name,
                    'email' : $scope.newUser.email
                }
            })
            .success(function(response){
                alert(response);
                $location.path('/account/login');
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );

    };
});

app.controller('AccountController', function($scope, $localStorage, $sessionStorage, $http, $location){

    // Create static copy of user data for form usage (otherwise any temporary changes will bind permanently to $localStorage)
    $scope.formData = $.extend(true,{},$localStorage.user);

    // Update user's account with new data
    $scope.updateAccount = function(){
        $http({
            method: 'POST',
            url: '/account/update',
            data: {
                'username': $scope.formData.username,
                'password': $scope.password,
                'name' : $scope.formData.name,
                'email' : $scope.formData.email
            }
        })
            .success(function(response){
                $localStorage.user = $scope.formData;
                alert(response);
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When an array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );
    };

    // Delete user's account
    $scope.deleteAccount = function(){
        var response = confirm("Are you sure you want to delete your account? This cannot be undone!");
        if(response == true){
            $http({
                method: 'POST',
                url: '/account/delete',
                data: {
                    'username': $scope.formData.username
                }
            })
                .success(function(response){
                    $localStorage.$reset();
                    alert(response);
                    $location.path('/');
                })
                .error(function(response){
                    alert(response);
                }
            );
        }
    };
});

app.controller('reviewController', function($scope, $location, $http){

      $http({
        method: 'GET',
        url: '/account/review',
            data: {

              'username': $scope.user.user.username,
              'submitter':$scope.SubmitForm1.submitter,
              'CoSubmitters':$scope.SubmitForm1.cosubmitter,
              'InnovationTitle':$scope.SubmitForm1.InnovationTitle,
              'description':$scope.SubmitForm1.description,
            //  'product':$scope.SubmitForm1.product,
              'gitlink':$scope.SubmitForm1.gitlink,
              'component':$scope.SubmitForm1.component,
              'os':$scope.SubmitForm1.os
                }
            })


});
app.controller('dashboardController', function($scope, $location, $http){



});

app.controller('ProtectedController', function($scope, $location, $http){

    $http({
        method: 'GET',
        url: '/protected'
    })
        .success(function(response){
            $scope.message = response;
        })
        .error(function(response){
            alert(response);
            $location.path('/account/login');
        }
    );

});







/*********************************
 Routing
 *********************************/
app.config(function($routeProvider) {
    'use strict';

    $routeProvider.

        //Root
        when('/', {
          templateUrl: 'views/home1.html',
          controller: 'VoteController'
        }).

        //get project based on id
        when('/dash/home/:id', {
            templateUrl: 'views/project.html',
            controller: 'ProjectController'
        }).


        when('/dash/project/:id', {
            templateUrl: 'views/vote.html',
            controller: 'VoteSubmitController'
        }).
        when('/dash/project', {
            templateUrl: 'views/home1.html',
            controller: 'VoteController'
        }).
        when('/account/search', {
            templateUrl: 'views/search.html',
            controller: 'SearchController'
        }).
// admin routing
        when('/account/admin', {
          templateUrl: 'views/home.html',
          controller: 'adminController'
        }).

        //Login page
        when('/account/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).

        //Account page
        when('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        }).

        //Create Account page
        when('/account/create', {
            templateUrl: 'views/create_account.html',
            controller: 'CreateAccountController'
        }).

        when('/account/review', {
            templateUrl: 'views/review.html',
            controller: 'reviewController'
        }).

        //admin routing
        when('/account/review', {
            templateUrl: 'views/home.html',
            controller: 'reviewController'
        }).
        // add project
        when('/account/submit',{
             templateUrl: 'views/submit.html',
            controller: 'submitController'
        }).

        when('/account/dashboard',{
             templateUrl: 'views/notifications.html',
            controller: 'dashboardController'
        }).

        //Protected page
        when('/protected', {
            templateUrl: 'views/protected.html',
            controller: 'ProtectedController'
        });




});
