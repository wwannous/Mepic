//#region General Variables
var browserI = undefined;
var errorMessageTimeout = 6000;

//#endregion
// (function (ng) {
//     'use strict';
  
//     var app = ng.module('ngLoadScript', []);
  
//     app.directive('script', function() {
//       return {
//         restrict: 'E',
//         scope: false,
//         link: function(scope, elem, attr) {
//           if (attr.type=='text/javascript-lazy') {
//             var code = elem.text();
//             var f = new Function(code);
//             f();
//           }
//         }
//       };
//     });
  
//   }(angular));

var app = angular.module('appDeck', ['ui.router', 'LocalStorageModule', 'ngMap', 'ngSanitize']);

app.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $urlRouterProvider
        // .when('/', '/home')
        .when('', ['$state', 'AuthService', function ($state, AuthService) {
            console.log("$state");
            console.log($state.$current);

            var authorizedRoles;

            try {
                authorizedRoles = toState.data.authorizedRoles ? toState.data.authorizedRoles : '';
            } catch (err) {
                authorizedRoles = 'admin'
            }

            $state.go('app.home');

            //      if (!AuthService.isAuthorized(authorizedRoles)) {
            // if (AuthService.isAuthenticated()) {
            //     $state.go('app.dashboard');
            // }
            // else {
            //     $state.go('app.login');
            // }

            // } 
            // else {
            //     $state.go('app.home');
            // }
        }])
        .otherwise("/landingpage");


    var states = [


        //#region Forgot Password
        {
            name: 'forgotpassword',
            url: '/forgotpassword',
            authenticate: false,
            templateUrl: 'templates/membership/password_forgot_request.htm',
            controller: 'Password_Forgot_Ctrl',
        },
        //#endregion
        //#region Forgot Password Success
        {
            name: 'forgotpasswordsuccess',
            url: '/forgotpasswordsuccess',
            authenticate: false,
            templateUrl: 'templates/membership/password_forgot_success.htm',
            controller: 'Password_Forgot_Success_Ctrl',
        },
        //#endregion
        //#region Reset Password
        {
            name: 'resetpassword',
            url: '/resetpassword?token&email',
            authenticate: false,
            templateUrl: 'templates/membership/password_reset.htm',
            controller: 'Password_Reset_Ctrl',
        },
        //#endregion
        //#region Reset Password Success
        {
            name: 'resetpasswordsuccess',
            url: '/resetpasswordsuccess',
            authenticate: false,
            templateUrl: 'templates/membership/password_reset_success.htm',
            controller: 'Password_Reset_Success_Ctrl',
        },
        //#endregion
        //#region registration Verification Email
        {
            name: 'registrationverificationemail',
            url: '/registrationverificationemail',
            authenticate: false,
            templateUrl: 'templates/membership/register_verification_email.htm',
            controller: 'Registration_Verification_Email_Ctrl',
        },
        //#endregion
        //#region registration Verification Sms
        {
            name: 'registrationverificationsms',
            url: '/registrationverificationsms',
            authenticate: false,
            templateUrl: 'templates/membership/register_verification_sms.htm',
            controller: 'Registration_Verification_Sms_Ctrl',
        },
        //#endregion
        //#region Auto Login 
        {
            name: 'autoLogin',
            url: '/autoLogin',
            authenticate: false,
            templateUrl: 'templates/membership/autoLogin.htm',
            controller: 'Auto_Login_Ctrl',
            params: {
                returnState: 'app.home',
                returnParams: {}
            }
        },
        //#endregion
        //#region App Initialization         
        {
            name: 'app',
            abstract: true,
            url: '/',
            authenticate: false,
            views: {
                '': {
                    templateUrl: 'templates/shared/app_master.htm',
                    controller: 'Master_Ctrl',
                },
                'header@app': 'appHeader',
                // 'menu@app': 'appMenu',
                'alert@app': 'appAlert',
                'footer@app': 'appFooter',
                // 'livechat@app': 'appLivechat',
                // 'alertinternet@app': 'appAlertInternet'
            },
            resolve: {
                userInfos: function resolveAuthentication(AuthResolver) {
                    return AuthResolver.resolve();
                }
            },
        },
        //#endregion        
        //#region Dashboard 
        {
            name: 'app.home',
            url: 'home',
            authenticate: false,
            templateUrl: 'templates/home/index.htm',
            controller: 'Home_Ctrl',
        },
        //#endregion
        {
            name: 'app.articleDetails',
            url: 'articleDetails/:id',
            authenticate: false,
            templateUrl: 'templates/article/details.htm',
            controller: 'ArticleDetails_Ctrl',
        },
        {
            name: 'app.articleCategory',
            url: 'articleCategory/:id',
            authenticate: false,
            templateUrl: 'templates/category/index.htm',
            controller: 'ArticleCategory_Ctrl',
            params: {
                subcategoryId: 0,
                countryId: 0
            }
        },
        {
            name: 'app.articleCategoryReport',
            url: 'articleCategoryReport',
            authenticate: false,
            templateUrl: 'templates/category/reportIndex.htm',
            controller: 'ArticleCategoryReport_Ctrl',
            params: {
                id: 0,
                subcategoryId: 0,
                countryId: 0
            }
        },
        {
            name: 'app.articleCategoryCountry',
            url: 'articleCategoryCountry',
            authenticate: false,
            templateUrl: 'templates/category/countryIndex.htm',
            controller: 'ArticleCategoryCountry_Ctrl',
            params: {
                id: 0,
                subcategoryId: 0,
                countryId: 0
            }
        },
        {
            name: 'app.search',
            url: 'search/:term',
            authenticate: false,
            templateUrl: 'templates/search/index.htm',
            controller: 'Search_Ctrl',
        },
        {
            name: 'app.reportDetail',
            url: 'reportDetail/:id',
            authenticate: false,
            templateUrl: 'templates/report/details.htm',
            controller: 'ReportDetails_Ctrl',
        },
        //#region Contact Us 
        {
            name: 'app.contactus',
            url: 'contactus',
            authenticate: false,
            templateUrl: 'templates/contactus/index.htm',
            controller: 'ContactUs_Ctrl',
        },
        {
            name: 'app.locateus',
            url: 'locatues',
            authenticate: false,
            templateUrl: 'templates/locateus/index.htm',
            controller: 'LocateUs_Ctrl',
        },
        {
            name: 'app.messageus',
            url: 'messageus',
            authenticate: false,
            templateUrl: 'templates/contactus/message.htm',
            controller: 'MessageUs_Ctrl',
        },
        {
            name: 'app.thankyou',
            url: 'thankyou',
            authenticate: false,
            templateUrl: 'templates/contactus/thankyou.htm',
            controller: 'MessageThankYou_Ctrl',
        },
        {
            name: 'app.aboutus',
            url: 'aboutus',
            authenticate: false,
            templateUrl: 'templates/aboutus/index.htm',
            controller: 'AboutUs_Ctrl',
        },
        {
            name: 'app.rooms',
            url: 'rooms',
            authenticate: false,
            templateUrl: 'templates/rooms/index.htm',
            controller: 'Rooms_Ctrl',
        },
        {
            name: 'app.restaurants',
            url: 'restaurants',
            authenticate: false,
            templateUrl: 'templates/products/restaurants.htm',
            controller: 'Restaurants_Ctrl',
        },
        {
            name: 'app.spa',
            url: 'spa',
            authenticate: false,
            templateUrl: 'templates/products/spa.htm',
            controller: 'Spa_Ctrl',
        },
        {
            name: 'app.watergate',
            url: 'watergate',
            authenticate: false,
            templateUrl: 'templates/products/watergate.htm',
            controller: 'Watergate_Ctrl',
        },
        {
            name: 'app.listing',
            url: 'listing/:id',
            authenticate: false,
            templateUrl: 'templates/products/listing.htm',
            controller: 'ProductListing_Ctrl',
        },
        {
            name: 'app.productDetails',
            url: 'products/details/:id',
            authenticate: false,
            templateUrl: 'templates/products/details.htm',
            controller: 'ProductsDetails_Ctrl',
        },
        {
            name: 'app.terms',
            url: 'terms',
            authenticate: false,
            templateUrl: 'templates/terms/index.htm',
            controller: 'Terms_Ctrl',
        },
        {
            name: 'app.privacy',
            url: 'privacy',
            authenticate: false,
            templateUrl: 'templates/privacy/index.htm',
            controller: 'Privacy_Ctrl',
        },
        //#region Login
        {
            name: 'app.login',
            url: 'login',
            authenticate: false,
            templateUrl: 'templates/membership/login.htm',
            controller: 'Login_Ctrl',
            params: {
                returnState: 'app.home',
                returnParams: {}
            }
        },
        //#region Edit Profile
        {
            name: 'app.editProfile',
            url: 'editProfile',
            authenticate: true,
            templateUrl: 'templates/membership/edit_profile.htm',
            controller: 'Edit_profile_Ctrl',
        },
        {
            name: 'app.addressbook',
            url: 'addressbook',
            authenticate: true,
            templateUrl: 'templates/membership/addressbook.htm',
            controller: 'AddressBook_Ctrl',
        },
        //#endregion   
        //#endregion
        //#region Register
        {
            name: 'app.register',
            url: 'register',
            authenticate: false,
            templateUrl: 'templates/membership/register.htm',
            controller: 'Registration_Ctrl',
            params: {
                userInfo: null
            }
        },
        {
            name: 'app.forgotpass',
            url: 'forgotpass',
            authenticate: false,
            templateUrl: 'templates/membership/forgotpass.htm',
            controller: 'Password_Forgot_Ctrl'
        },
        {
            name: 'app.forgotpasswordsuccess',
            url: 'forgotpasswordsuccess',
            authenticate: false,
            templateUrl: 'templates/membership/forgotpasswordsuccess.htm',
            controller: 'Password_Forgot_Ctrl'
        },
        {
            name: 'app.resetpass',
            url: 'resetpass?resetpassword&email',
            authenticate: false,
            templateUrl: 'templates/membership/resetpass.htm',
            controller: 'ResetPassController',
        },
        {
            name: 'app.resetpasssuccess',
            url: 'resetpasssuccess',
            authenticate: false,
            templateUrl: 'templates/membership/resetpasswordsuccess.htm',
        },
        //#endregion
        //#region My Cart
        {
            name: 'app.mycart',
            url: 'mycart?openGiftModal',
            authenticate: false,
            templateUrl: 'templates/mycart/index.htm',
            controller: 'MyCartController',
        },
        //#endregion
        //#region Shipping & Payment
        {
            name: 'app.payment',
            url: 'payment',
            authenticate: true,
            templateUrl: 'templates/membership/payment.htm',
            controller: 'ShippingPayment_Ctrl',
        },
        {
            name: 'app.receipt',
            url: 'receipt/:id',
            authenticate: true,
            templateUrl: 'templates/membership/orderDetails.htm',
            controller: 'OrderDetails_Ctrl',
        },
        {
            name: 'app.orders',
            url: 'orders',
            authenticate: true,
            templateUrl: 'templates/membership/myorders.htm',
            controller: 'Orders_Ctrl',
        },
        {
            name: 'app.newaddress',
            url: 'address/new',
            authenticate: true,
            templateUrl: 'templates/membership/newaddress.htm',
            controller: 'AddAddress_Ctrl',
            params: {
                isPayment : null
            }
        },
        {
            name: 'app.editaddress',
            url: 'address/edit/:id/:isBilling',
            authenticate: true,
            templateUrl: 'templates/membership/newaddress.htm',
            controller: 'EditAddress_Ctrl',
        },
        //#endregion
        //#region DSL/FO Plans 
        {
            name: 'app.dslFoPlans',
            url: 'dslFoPlans',
            authenticate: false,
            templateUrl: 'templates/dsl/plans.htm',
            controller: 'DslFoPlans_Ctrl',
        },
        //#endregion
        //#region DSL/FO Request 
        {
            name: 'app.dslFoRequest',
            url: 'dslFoRequest',
            authenticate: false,
            templateUrl: 'templates/dsl/request.htm',
            controller: 'DslFoRequest_Ctrl',
        },
        //#endregion
        //#region DSL/FO Request Success
        {
            name: 'app.dslFoRequestSuccess',
            url: 'dslFoRequestSuccess',
            authenticate: false,
            templateUrl: 'templates/dsl/request_success.htm',
            controller: 'DslFoRequest_Success_Ctrl',
        },
        //#endregion
        //#region DSL/FO Application Form
        {
            name: 'app.dslFoApplicationForms',
            url: 'dslFoApplicationForms',
            authenticate: false,
            templateUrl: 'templates/dsl/application_forms.htm',
            controller: 'DslFoApplication_Forms_Ctrl',
        },
        //#endregion
        //#region DSL/FO Status
        {
            name: 'app.dslFoStatus',
            url: 'dslFoStatus',
            authenticate: false,
            templateUrl: 'templates/dsl/status.htm',
            controller: 'DslFoStatus_Ctrl',
        },
        //#endregion
        //#region Recharge Plans
        {
            name: 'app.rechargeplans',
            url: 'rechargeplans',
            authenticate: false,
            templateUrl: 'templates/products/plans.htm',
            controller: 'Recharge_Plans_Ctrl',
        },
        //#endregion
        //#region Recharge Plans
        {
            name: 'app.rechargepurchase',
            url: 'rechargepurchase',
            authenticate: false,
            templateUrl: 'templates/products/purchase.htm',
            controller: 'Recharge_Purchase_Ctrl',
        },
        //#endregion
        //#region Recharge Plans
        {
            name: 'app.rechargereceipt',
            url: 'rechargereceipt',
            authenticate: false,
            templateUrl: 'templates/products/receipt.htm',
            controller: 'Recharge_Receipt_Ctrl',
        },
        //#endregion      
    ];

    states.forEach(function (state) {
        $stateProvider.state(state.name, state)
    });

});



app.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('sessionInjector');
        }
    ]);
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('app')
});

app.run(function ($uiRouter, $rootScope, Basket, $transitions, $state, $stateParams, $http, $timeout, AUTH_EVENTS, AuthService, Session, storageService, localStorageService, SERVER_CONFIG, DataCaching, JSHelper) {
    // AuthService.GetMenuItems().then(function (res){
    //   console.log('hey');
    //   $rootScope.userMenu = res;
    // });
    var language = storageService.GetStorage('NG_TRANSLATE_LANG_KEY');
    $rootScope.resizeUrl = SERVER_CONFIG.resizeUrl;
    $rootScope.baseurl = SERVER_CONFIG.baseUrl;
    $rootScope.websiteUrl = SERVER_CONFIG.websiteUrl;

    $rootScope.goBack = function() {
        window.history.back();
    };

    addthis.init();

    $rootScope.addthis_open = function (event, param1, param2, param3, param4) {
        return addthis_open(event.currentTarget, '', $rootScope.websiteUrl+param2, param3);
    }
    $rootScope.addthis_send = function (event, param1, param2, param3, param4) {
        //window.open("https://www.addthis.com/bookmark.php?url="+$rootScope.websiteUrl+param2, '_system', '');
        //event.preventDefault();
        //return addthis_open(event.currentTarget, '', $rootScope.websiteUrl+param2, param3);
        //addthis_open($rootScope.websiteUrl+link, $rootScope.websiteUrl+link, $rootScope.websiteUrl+link,);
        var message_title = param3;
        if (param3.substr(param3.length - 1) != ('.' || '!' || '?')) {
            message_title = message_title + ". ";
        } else if (param3.substr(param3.length - 1) != ' ') {
            message_title = message_title + " ";
        }
        console.log(message_title + "Follow this link : ");
        var options = {
            message: message_title + "Follow this link : ", // not supported on some apps (Facebook, Instagram)
            subject: param3, // fi. for email
            files: ['', ''], // an array of filenames either locally or remotely
            url: param2,
            chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
            // appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
        };

        var onSuccess = function (result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
        };
        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }
    $rootScope.addthis_close = function () {
        addthis_close();
    }

    if(language != null){
        $rootScope.currentLang = language == 'en' ? '' : language;
    }
    else{
        $rootScope.currentLang = 'ar';
    }

    DataCaching.InitializeDataCaching();

    $http.get(SERVER_CONFIG.baseUrl + "api/data/GetGlobalData").then(function successCallback(response) {

            $rootScope.globalData = response.data;
            $rootScope.social = response.data.social;

            setTimeout(function(){
                // $(document).on('click', function (e) {
                //     if ($(e.target).closest(".open-menu").length === 0) {
                //       $('header .nav-item').removeClass('open-menu');
                //       $('header .nav-item .nav-link').removeClass('nav-link-active')
                //     }
                    
                //     if (e.target.classList.value != "fas fa-search" && e.target.classList.value != "field-search") {
                //       // $('header .field-search').fadeOut();
                //       // $('.search-btn-mobile').fadeOut();
                //       $('.header-logo-menu').removeClass('open-search');
                //       $('.holder-nav-search').removeClass('holder-nav-search-active');
                //     }
                //   });
                  //_chartTab();
                  //headerScroll();
                  //InitSwiperPopup();
                  //headerSearchBtn();
                  //headerMenuDropdown();
                  //fixedScrolling();
                  //homeActivePopup();
                  //InitHtmlInclude();
            }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $rootScope.previousDateStatements = "";
    $rootScope.nextDateStatements = "";
    $rootScope.mustReloadState = false;


    //#region Navigation Option
    $rootScope.navigationOpt = {
        headerTitle: "",
        headerLevel: 0,
        backUrl: "",
        footerFamily: ""
    }

    //#region Header Title
    $rootScope.SetHeaderTitle = function (title) {
        $rootScope.navigationOpt.headerTitle = title;
    }
    $rootScope.GetHeaderTitle = function () {
        return $rootScope.navigationOpt.headerTitle;
    }
    //#endregion

    //#region Header Level
    $rootScope.SetHeaderLevel = function (level) {
        $rootScope.navigationOpt.headerLevel = level;
    }
    $rootScope.GetHeaderLevel = function () {
        return $rootScope.navigationOpt.headerLevel
    }
    //#endregion

    //#region Back Url
    $rootScope.SetbackUrl = function (bkUrl) {
        $rootScope.navigationOpt.backUrl = bkUrl;
    }
    $rootScope.GetbackUrl = function () {
        return $rootScope.navigationOpt.backUrl;
    }
    //#endregion

    //#region Footer Family
    $rootScope.SetFooterFamily = function (ftrFamily) {
        $rootScope.navigationOpt.footerFamily = ftrFamily;
    }
    $rootScope.GetFooterFamily = function () {
        return $rootScope.navigationOpt.footerFamily;
    }
    //#endregion

    //#region Header Classes
    $rootScope.SetHeaderClasses = function (hdrClasses) {
        $rootScope.navigationOpt.headerClasses = hdrClasses;
    }
    $rootScope.GetHeaderClasses = function () {
        return $rootScope.navigationOpt.headerClasses;
    }
    //#endregion

    /**
     * Prepare the State's custom infos for better navigation
     * @param {*} headerTitle 
     * @param {*} footerFamily 
     * @param {*} backUrl 
     * @param {*} headerLevel 
     * @param {*} headerClasses 
     */
    $rootScope.SetStateNavOptn = function (headerTitle, footerFamily, backUrl, headerLevel, headerClasses) {
        if (headerTitle != "") {
            $rootScope.SetHeaderTitle(headerTitle);
        }
        if (footerFamily != "") {
            $rootScope.SetFooterFamily(footerFamily);
        }
        if (backUrl != "") {
            $rootScope.SetbackUrl(backUrl);
        }
        if (headerLevel != "") {
            $rootScope.SetHeaderLevel(headerLevel);
        }
        if (headerClasses != "") {
            $rootScope.SetHeaderClasses(headerClasses);
        }
    }

    $rootScope.CloseNavMenu = function(){
        $('header.header').removeClass('moved');
        $('footer.footer').removeClass('moved');
        $('.nav-overlay').removeClass('visible');
        $('.nav__wrapper').removeClass('visible');
    }

    $rootScope.ToggleHeader = function(){
        $('header.header').toggleClass('moved');
        $('header.header').toggleClass('moved');
        $('.nav-overlay').toggleClass('visible');
        $('.nav__wrapper').toggleClass('visible');
    }

    //#endregion

    $timeout(function () {
        if (device && !$("html").hasClass("isIOS")) {
            var isiOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";
            if (isiOS) {
                $("html").addClass("isIOS");
            }
        }
    }, 1000)

    if (AuthService.isAuthenticated()) {
        Session.create(localStorageService.get('token'), 'admin');
    }

    $transitions.onStart({}, function (trans) {

        if($('#navbarSupportedContent').hasClass('show')){
            $('header .burger-menu').trigger('click');
        }

        if(typeof(removeFixed) !== 'undefined'){
            removeFixed();
        }
        
        $('body').removeClass('is-lock');
        
        $('#loaderDivForced').removeClass('show');

        $('body .header-logo-menu').removeClass('open-search');

        Basket.getBasket();

        $rootScope.currentUser = {};
        var fromState = trans.$from();
        var toState = trans.$to();
        var targetState = trans.targetState();
        var authorizedRoles;

        $rootScope.fromState = fromState;
        $rootScope.stateParams = angular.copy($stateParams);
        // console.log(toState.name);

        $(window).scrollTop(0);

        // //If No Internet is Open close it 
        // if ($("#modal-internet-connection").hasClass("is-visible")) {
        //     JSHelper.ClosePanel("#modal-internet-connection");
        // }

        //Clear Statements Previous and next Dates 
        if (fromState.name.includes("statementofaccount")) {
            if (!toState.name.includes("statementofaccount") && ($rootScope.previousDateStatements != "" || $rootScope.nextDateStatements != "")) {
                console.log("clearing the dates");
                $rootScope.previousDateStatements = "";
                $rootScope.nextDateStatements = "";
            }
        }

        if (fromState.name.includes("statementofaccount")) {
            if (!toState.name.includes("statementofaccount") && ($rootScope.previousDateStatements != "" || $rootScope.nextDateStatements != "")) {
                console.log("clearing the dates");
                $rootScope.previousDateStatements = "";
                $rootScope.nextDateStatements = "";
            }
        }

        if (Session.refillWhileBuyingUrl != null &&
            ((fromState.name.includes("productslisting") && !angular.equals((toState.name).substring(4, (toState.name).length), 'refill')) ||
                (angular.equals((fromState.name).substring(4, (fromState.name).length), 'refill') && !angular.equals((toState.name).substring(4, (toState.name).length), 'refillcreditcardrequest')) ||
                (angular.equals((fromState.name).substring(4, (fromState.name).length), 'refillcreditcardrequest') && !toState.name.includes("refillcreditcardsuccess"))
            )
        ) {
            Session.DeleteByKey("refillWhileBuyingUrl");
        }


        try {
            authorizedRoles = toState.data.authorizedRoles ? toState.data.authorizedRoles : '';
        } catch (err) {
            authorizedRoles = 'admin'
        }

        if (!AuthService.isAuthorized(authorizedRoles)) {
            // event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                console.log("broadcast: AUTH_EVENTS.notAuthorized");
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
            else {
                // user is not logged in
                console.log("broadcast: AUTH_EVENTS.notAuthenticated");
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                if (toState.authenticate != false) {
                    // $state.target("login",{ returnState: toState.name, returnParams: toState.params });
                    //trans.router.stateService.target('login');
                    //$state.target('login');
                    return $state.target("app.login", {
                        returnState: toState.name,
                        returnParams: targetState.params()
                    });
                }
            }
        }
        // else {
        //     if (toState.name == 'login') {
        //         // console.log('toState');
        //         // console.log(toState);
        //         return $state.target("app.home", {
        //             returnState: toState.name
        //         });
        //     }
        //     if (toState.name == 'app.home') {
        //         // console.log('toState');
        //         // console.log(toState);
        //         return $state.target("app.dashboard", {
        //             returnState: toState.name
        //         });
        //     }
        // }

    });

    $transitions.onFinish({}, function (trans) {
        // $(window).scroll(function(){
        //     if ($(window).scrollTop() >= 100) {
        //         $('.header-logo-menu').addClass('fixed-header');
        //         $('.holder-menu').append().insertBefore('.navbar-brand');
        //         $('nav').removeClass('fixed-header');
        //     }
        //     else {
        //       $('.header-logo-menu').removeClass('fixed-header');
        //     }
        // });
        $rootScope.CloseNavMenu();
        //JSHelper.CloseMenu();
    });

    $transitions.onRetain({}, function (trans) {
        JSHelper.CloseMenu();
    });

    $transitions.onBefore({}, function (trans) {
        if (trans._treeChanges.from[2] && trans._treeChanges.to[2]) {
            var fromState = trans._treeChanges.from[2].state.name;
            var toState = trans._treeChanges.to[2].state.name;
            if (fromState == toState) {
                JSHelper.CloseMenu();
            }
        } // When clicking on the same state close menu         
    });

    $rootScope.$on([AUTH_EVENTS.notAuthenticated], function (event, parameters) {
        if (!($state.current.authenticate == false)) {

            Session.destroy();
            $state.target('login');

        }
    });
    $rootScope.$on([AUTH_EVENTS.ressourceNotFound], function (event, parameters) {
        console.log('errorlog');
        console.log(parameters);

    });
    $rootScope.$on([AUTH_EVENTS.networkErrorGetting], function (event, parameters) {
        console.log("AUTH_EVENTS: networkErrorGetting", AUTH_EVENTS.networkErrorGetting);
        $timeout(function () {
            //alert('disconnected');

            JSHelper.OpenPanel("#modal-internet-connection");
            $rootScope.mustReloadState = true;
            if (!$rootScope.$$phase && !$rootScope.$root.$$phase) {
                $rootScope.$apply();
            }
        }, 500);

        // $state.reload();
    });
    $rootScope.$on([AUTH_EVENTS.networkErrorPosting], function (event, parameters) {
        console.log("AUTH_EVENTS: networkErrorPosting", AUTH_EVENTS.networkErrorPosting);
        $timeout(function () {
            //alert('disconnected');

            JSHelper.OpenPanel("#modal-internet-connection");
            $rootScope.mustReloadState = false;
            if (!$rootScope.$$phase && !$rootScope.$root.$$phase) {
                $rootScope.$apply();
            }
        }, 500);
    });

    // Redirect from outside to app
    $rootScope.getUrlVars = function (url) {

        var vars = [], hash;
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        console.log(hashes);
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $rootScope.reportAppLaunched = function (url) {

        console.log(url);
        var newState = url.match("://(.*)\\?");
        var params = $rootScope.getUrlVars(url);
        console.log(params);
        console.log(newState[1]);
        $state.go(newState[1], params);
    }

    // Notification callBack
    $rootScope.FetchUserInfos = function () {
        var dataToSend = {
            appOs: window.device != undefined ? window.device.platform : "",
            appVersion: appVersion
        }
        $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + 'api/EndUsers/getuserinfo',
            data: dataToSend
        }).then(function (res) {
            console.log(res.data);
            Session.userInfos = res.data;

            $rootScope.$broadcast(Session.userInfos);
        }, function (error) {
            console.log("error");
            //deferred.resolve(error);
        });
    }
});

app.run(function ($trace) {
    $trace.enable('TRANSITION');
});

app.service('Basket', function ($rootScope, $http, $httpParamSerializer, SERVER_CONFIG, Session, Basket_EVENTS, localStorageService) {
    basket = {};

    this.getBasket = function () {

        $http.get(SERVER_CONFIG.baseUrl + 'api/MyCart/GetMyBagData?v=' + Math.random()).then(function successCallback(response) {
            basket = response.data;
            if (response.data.User === "null" && Session.firstName != undefined || response.data.UserId == 0 && Session.firstName != undefined) {
                Session.destroy();
            }
            $rootScope.$broadcast(Basket_EVENTS.itemAdded, { myBag: basket });
            //    if(response.data.UserId == null)
            //    {
            //         Session.destroy();
            //    }
            //$scope.countries = data.data.countries;
        },  function errorCallback(response) {
            
        });

    }
    this.returnBasket = function () {
        return basket;
    }
    this.basketCount = function () {
        return basket.productsQuantity ? basket.productsQuantity : 0;
    }
    this.addToBasket = function (item) {
        $http.post(SERVER_CONFIG.baseUrl + 'api/MyCart/AddToBasket', item).then(function successCallback(result) {
            if (result.status == 200) {
                $('#ekomBasketId').val(result.basketId);
                //             // $scope.UpdateBasketData(result);
                basket = result.data;
                $rootScope.$broadcast(Basket_EVENTS.itemAdded, { myBag: basket });
                localStorageService.set('basketId', result.data.basketId == 0 ? null : result.data.basketId);
            }
        });
        //basket.products = [1,2];
        //$rootScope.$broadcast(Basket_EVENTS.itemAdded);

    }


});

function handleOpenURL(url) {
    setTimeout(function () {
    var elem = $('html').eq(0);
    var mainController = angular.element(elem).scope();
    mainController.reportAppLaunched(url);
    }, 2000);
}