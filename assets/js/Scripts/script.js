// Code goes here

// Add your code here

var app = angular.module('myApp', ['ngMessages']);

app.controller('myCtrl', function($scope) {
  $scope.ContactForm = function() {
    var itemForm = $scope.contactForm;
    var form = itemForm.$$element;

    if (itemForm.$valid) {
      console.log('formValid');
      $(form).find(".btn-wrapper").addClass("loading");
      HandleRequest();
    } else {
      console.log('formValid NOT');
      var allFields = angular.element("[name='" + itemForm.$name + "']").find('.ng-invalid:visible');
      angular.forEach(allFields, function(value, key) {
        var fieldName = $(value).attr("name");
        itemForm[fieldName].$setTouched();
      });
    }
    return false;

    function HandleRequest() {
      console.log("send the request");
      setTimeout(function() {
        $(form).find(".btn-wrapper").removeClass("loading");
      }, 4000);
    }
  }

  $scope.newsLetterSubmitForm = function() {
    var itemForm = $scope.newsLetterForm;
    var form = itemForm.$$element;

    if (itemForm.$valid) {
      console.log('formValid');
      $(form).find(".btn-wrapper").addClass("loading");
      HandleRequest();
    } else {
      console.log('formValid NOT');
      var allFields = angular.element("[name='" + itemForm.$name + "']").find('.ng-invalid:visible');
      angular.forEach(allFields, function(value, key) {
        var fieldName = $(value).attr("name");
        itemForm[fieldName].$setTouched();
      });
    }
    return false;

    function HandleRequest() {
      console.log("send the request");
      setTimeout(function() {
        $(form).find(".btn-wrapper").removeClass("loading");
      }, 4000);
    }
  }


  $scope.SubmitFormTwo = function() {
    var itemForm = $scope.exampleForm2;
    var form = itemForm.$$element;

    if (itemForm.$valid) {
      console.log('formValid');
      $(form).find(".btn-wrapper").addClass("loading");
      HandleRequest();
    } else {
      console.log('formValid NOT');
      var allFields = angular.element("[name='" + itemForm.$name + "']").find('.ng-invalid:visible');
      angular.forEach(allFields, function(value, key) {
        var fieldName = $(value).attr("name");
        itemForm[fieldName].$setTouched();
      });
    }
    return false;

    function HandleRequest() {
      console.log("send the request");
      setTimeout(function() {
        $(form).find(".btn-wrapper").removeClass("loading");
      }, 4000);
    }
  }

  $scope.SubmitFormThree = function() {
    var itemForm = $scope.exampleForm3;
    var form = itemForm.$$element;

    if (itemForm.$valid) {
      console.log('formValid');
      $(form).find(".btn-wrapper").addClass("loading");
      HandleRequest();
    } else {
      console.log('formValid NOT');
      var allFields = angular.element("[name='" + itemForm.$name + "']").find('.ng-invalid:visible');
      angular.forEach(allFields, function(value, key) {
        var fieldName = $(value).attr("name");
        itemForm[fieldName].$setTouched();
      });
    }
    return false;

    function HandleRequest() {
      console.log("send the request");
      setTimeout(function() {
        $(form).find(".btn-wrapper").removeClass("loading");
      }, 4000);
    }
  }
});

app.directive('formEmail', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.formEmail = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(viewValue);

        //   if (INTEGER_REGEXP.test(viewValue)) {
        //     // it is valid
        //     return true;
        //   }

        //   // it is invalid
        //   return false;
      };
    }
  };
});