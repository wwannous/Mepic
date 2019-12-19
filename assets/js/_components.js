//#region App Header
app.component('appHeader', {
    templateUrl: 'templates/shared/appHeader.htm',
    controller: function ($scope, $state, $rootScope, $timeout, JSHelper, Session, AuthService, Basket, Basket_EVENTS, CATEGORY_IDS, AUTH_EVENTS) {
        $scope.data = {};

        $scope.countryCategoryId = CATEGORY_IDS.article_category_country_id;
        $scope.reportCategoryId = CATEGORY_IDS.report_category_id;

        $scope.goToSearch = function (to , params){
            $state.go(to, {term:params});
            $scope.searchTerm = "";
            $('#SearchTerm').blur();
        }

        $scope.goBack = function () {
            window.history.back();
        };

        //#region Authentication
        $scope.isAuthenticated = AuthService.isAuthenticated();


        $rootScope.$on([AUTH_EVENTS.notAuthenticated], function (event, parameters) {
            $scope.isAuthenticated = AuthService.isAuthenticated();
        });

        $scope.logout = AuthService.logout;

        //#endregion

        //#region Styling Header 
        $scope.navigationOpt = $rootScope.navigationOpt;

        $scope.$watch('$parent.navigationOpt', function () {
            $scope.navigationOpt = $rootScope.navigationOpt;
            $scope.headerTitle = $scope.navigationOpt.headerTitle;
            $scope.headerLevel = $scope.navigationOpt.headerLevel;
            $scope.headerBackUrl = $scope.navigationOpt.backUrl;
            $scope.headerClasses = $scope.navigationOpt.headerClasses;
            $scope.footerFamily = $scope.navigationOpt.footerFamily;

            $scope.isInnerPage = ($scope.footerFamily != "dashboard") ? true : false;


        }, true);

        $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
            $scope.BasketCount = Basket.basketCount();
            $scope.basket = parameters.myBag;
        });

        $rootScope.$on([Basket_EVENTS.removeItemBasketConfirmed], function (event, parameters) {

            $scope.basket = parameters.basket;
        });

        $rootScope.$on([AUTH_EVENTS.loginSuccess], function (event, parameters) {
            $scope.isAuthenticated = AuthService.isAuthenticated();
            $scope.token = parameters.token;
        });

        $rootScope.$on([AUTH_EVENTS.logoutSuccess], function (event, parameters) {
            $scope.isAuthenticated = AuthService.isAuthenticated();
            $scope.token = parameters.token;
        });

        this.$onInit = function () {

            //navTrigger();

            //#region Initialize Header
            // var $win = $(window);
            // var $doc = $(document);
            // var $header = $('.header');
            // var winH = $win.height();
            // var $sectionHead = $('.section--main .section__head-scroll');
            // var scrollTopCurrent = 0;
            // var scrollTopPast = 0;
            // var topLimit = 203;


            // $('.nav-trigger').on('click', function (event) {
            //     event.preventDefault();
        
            //     $('.nav__wrapper').toggleClass('visible');
            //     $('.container').toggleClass('container-moved');
            //     $('.header').toggleClass('moved');
            //     $('.footer').toggleClass('moved');
            //     $('.nav-overlay').toggleClass('visible');
            // });
        
            // $('.nav-trigger-close').on('click', function (event) {
            //     event.preventDefault();
            
            //     $('.nav__wrapper').removeClass('visible');
            //     $('.container').removeClass('container-moved');
            //     $('.header').removeClass('moved');
            //     $('.footer').removeClass('moved');
            //     $('.nav-overlay').removeClass('visible');
            // });
        
            // $('.nav-overlay').on('click', function (event) {
            //     event.preventDefault();
            
            //     $('.nav__wrapper').removeClass('visible');
            //     $('.container').removeClass('container-moved');
            //     $('.header').removeClass('moved');
            //     $('.footer').removeClass('moved');
            //     $('.nav-overlay').removeClass('visible');
            // });
        
            // function animate(winST) {
            //     $('.animations').each(function () {
            //         if (winST + winH * 0.95 > $(this).offset().top) {
            //             var animClass = $(this).data('animation');
            
            //             if (!$(this).hasClass('animated')) {
            //                 $(this).addClass('animated');
            //                 $(this).addClass(animClass);
            //             }
            //         }
            //     });
            // };
            
            // $win.on('load scroll', function () {
            //     var winST = $win.scrollTop();
            
            //     animate(winST);
            
            //     scrollTopCurrent = $win.scrollTop();
            //     topLimit = $win.width() > 1024 ? 203 : 75;
        
            //     $header.toggleClass('fixed', scrollTopCurrent > topLimit);
            //     $header.toggleClass('shown', scrollTopCurrent < scrollTopPast);
            
            //     $sectionHead.toggleClass('fixed', scrollTopCurrent > topLimit);
            //     $sectionHead.toggleClass('shown', scrollTopCurrent < scrollTopPast);
            
            //     setTimeout(function () {
            //         scrollTopPast = scrollTopCurrent;
            //     }, 500);
            // });

            //#endregion



            $timeout(function () {
                $scope.data.appVersion = appVersion;
            }, 500)
        }


        //#endregion

        //#region User Info
        // $scope.walletBalance = Session.userInfos != undefined ? Session.userInfos.user.walletBalance : "";
        // $scope.initials = Session.userInfos != undefined ? (Session.userInfos.user.firstName.substring(0,1) + Session.userInfos.user.lastName.substring(0,1) ) : "";
        // $scope.loyaltyPoints = Session.userInfos != undefined ? Session.userInfos.user.loyaltyPoints + " Pts" : "";
        //#endregion

        $scope.GoToState = function (toState, stateParams, transitionParams) {
            location.href = toState;
        }

        // console.log(Session);

        // $scope.walletBalance = Session.userInfos != undefined ? Session.userInfos.user.walletBalance : "";
        // $scope.lowCreditAlertThreshold = Session.userInfos != undefined ? Session.userInfos.lowCreditAlertThreshold : false;

        // $rootScope.$on([Session.userInfos], function (event, parameters) {

        //     $scope.walletBalance = Session.userInfos != undefined ? Session.userInfos.user.walletBalance : "";
        //     $scope.lowCreditAlertThreshold = Session.userInfos != undefined ? Session.userInfos.lowCreditAlertThreshold : false;

        //     if ($scope.lowCreditAlertThreshold) {
        //         Helper.OpenPanel('#modal-money');
        //     }
        // });


        // this.$onInit = function () {
        //     Helper.InitializeMenuTrigger();
        //     Helper.InitializePanels();
        //     if ($scope.lowCreditAlertThreshold) {
        //         Helper.OpenPanel('#modal-money');
        //     }

        // }

        // $scope.ChangeState = function (newState) {
        //     this.state = newState;
        //     $state.go(newState);
        // }

        // $scope.GoToRefill = function (refillState) {
        //     $(".modal-overlay").click();
        //     $state.go(refillState);
        // }

        // $scope.TransitionToState = function (toState, stateParams, transitionParams) {
        //     return Helper.TransitionToState(toState, stateParams, transitionParams);
        // }


    }
});
//#endregion

//#region App Footer
app.component('appFooter', {
    templateUrl: 'templates/shared/appFooter.htm',
    controller: function ($scope, $state, $rootScope, CATEGORY_IDS, JSHelper, AuthService, AUTH_EVENTS) {

        $scope.countryCategoryId = CATEGORY_IDS.article_category_country_id;
        $scope.reportCategoryId = CATEGORY_IDS.report_category_id;

        this.$onInit = function () {
            //buyButton();
        }

        $scope.navigationOpt = $rootScope.navigationOpt;

        $scope.$watch('$parent.navigationOpt', function () {
            $scope.navigationOpt = $rootScope.navigationOpt;
            $scope.footerFamily = $scope.navigationOpt.footerFamily;
            $scope.headerLevel = $scope.navigationOpt.headerLevel;
        }, true);

        // //Helper.SVGBuilder();

        // $scope.isAuthenticated = AuthService.isAuthenticated();

        // $rootScope.$on([AUTH_EVENTS.notAuthenticated], function (event, parameters) {
        //     $scope.isAuthenticated = AuthService.isAuthenticated();
        // });

        // this.$onInit = function () {
        //     //Helper.InitializeFastClick();
        // }

        // //   $scope.TransitionToState = Helper.TransitionToState();

        // $scope.TransitionToState = function (toState, stateParams, transitionParams) {
        //     return Helper.TransitionToState(toState, stateParams, transitionParams);
        // }
    }
});
//#endregion

//#region App Footer
app.component('appAlert', {
    templateUrl: 'templates/shared/appAlert.htm',
    controller: function ($scope, $timeout, AuthService, AUTH_EVENTS) {

        //$scope.$watch('$scope.$parent.LandingMembershipState', function () {
        //    console.log("change");
        //}, true);

        $scope.isStateLandingMembership = $scope.$parent.LandingMembershipState != undefined && $scope.$parent.LandingMembershipState;
        $scope.lowerAlertStyling = (AuthService.isAuthenticated() || (!AuthService.isAuthenticated() && !$scope.isStateLandingMembership));
        //console.log($scope.isStateLandingMembership);
        //console.log($scope.lowerAlertStyling);

        $(".bar-alert .fa-close").click(function () {
            $(".bar-alert").removeClass("show-alert");
            $timeout(function () {
                $(".bar-alert .alert-mssg").text("");
            }, 100);
        });

        $(".main-wrapper section").bind("click", function () {
            if ($(".bar-alert").hasClass("show-alert")) {
                $(".bar-alert").removeClass("show-alert");
                $timeout(function () {
                    $(".bar-alert .alert-mssg").text("");
                }, 100);
            }
        });
    }
});
//#endregion

//#region App Alert Network
app.component('appAlertNetwork', {
    templateUrl: 'templates/shared/appAlertNetwork.htm',
    controller: function ($scope, $state, $rootScope, JSHelper, AuthService, AUTH_EVENTS) {
        $scope.isStateLandingMembership = $scope.$parent.LandingMembershipState != undefined && $scope.$parent.LandingMembershipState;
        $scope.lowerAlertStyling = (AuthService.isAuthenticated() || (!AuthService.isAuthenticated() && !$scope.isStateLandingMembership));

        this.$onInit = function () {
            // Helper.InitializeFastClick();
        }
        $scope.ClosePanel = JSHelper.ClosePanel;

        $scope.ReloadState = function () {
            if ($rootScope.mustReloadState) {
                $state.reload();
            }
            JSHelper.ClosePanel("#modal-network-connection");
        }
    }
});
//#endregion