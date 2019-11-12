/**
 * CONDITIONALLY EXECUTED UI-SREF
 * Create a directive that allows me to interrupt the chain of events that end up changing state. 
 * For convenience and other uses also prevents the execution of ng-click on the same element.
 * Eg: [ui-sref="somestate" eat-click-if="!model.isValid()"]
 */
app.directive('uiSrefDisable', ['$parse', '$rootScope',
  function($parse, $rootScope) {
    return {
      // this ensure eatClickIf be compiled before ngClick
      priority: 100,
      restrict: 'A',
      compile: function($element, attr) {
        var fn = $parse(attr.eatClickIf);
        return {
          pre: function link(scope, element) {
            var eventName = 'click';
            element.on(eventName, function(event) {
              var callback = function() {
                if (fn(scope, {$event: event})) {
                  // prevents ng-click to be executed
                  event.stopImmediatePropagation();
                  // prevents href 
                  event.preventDefault();
                  return false;
                }
              };
              if ($rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });
          },
          post: function() {}
        }
      }
    }
  }
]);

app.directive('magnificPopup',
    [
        "$compile", 
        function($compile) {
            return {
                restrict: 'A',
                scope: { shippingaddress : '='},
                link: function($scope, element, attr) {
                    attr.callbacks = {
                        ajaxContentAdded: function() {
                            //region plugin
                            var $popup = $('.popup');
                            $popup.addClass('show');
                      
                            $(this.container).find('.link-popup').magnificPopup({
                              type: 'ajax',
                              showCloseBtn: true,
                              removalDelay: 500,
                              mainClass: 'mfp-fade'
                            });
                      
                            $('.btn-close-popup').on('click', function (event) {
                              $.magnificPopup.close();
                            });
                            //endregion

                            var content = this.content;
                           
                            var scope =  content.scope();
                            $compile(content)(scope);
                            //scope.$digest();

                            var popup = $('.mfp-content .popup');
                            var popupscope = popup.scope();
                            popupscope.model = $scope.shippingaddress;
                            popupscope.item = $scope.$parent.item;

                            scope.$digest();
                        },
                        //region plugin2
                        beforeClose: function beforeClose() {
                          var $popup = $('.popup');
                    
                          $popup.removeClass('show');
                        }
                        //endregion
                    };

                    $('.btn-close-popup').on('click', function (event) {
                      $.magnificPopup.close();
                    });

                    element.magnificPopup(attr);
                    
                }
            }
        }
    ]
);

app.directive("loader", function ($rootScope) {
  return function ($scope, element, attrs) {
      $scope.$on("loader_show", function () {
          return element.addClass('show');
      });
      return $scope.$on("loader_hide", function () {
          return element.removeClass('show');
      });
  };
}
)
