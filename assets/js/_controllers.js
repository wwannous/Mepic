app.controller('Master_Ctrl', function ($scope, $rootScope, $timeout, JSHelper, myServices, AuthService, Basket, Basket_EVENTS, $state, $stateParams, SERVER_CONFIG) {
    $scope.kms_host = SERVER_CONFIG.image_host;
    $rootScope.state = $state.current;

    this.$onInit = function () {
        //globalFunctions();
        JSHelper.FormFieldsValidatePreSubmit();
        $timeout(function(){
            if (AuthService.isAuthenticated()) {
                AuthService.UpdateLastLogin();
            }
        },1000);
    }
})

//#region Membership

app.controller('Login_Ctrl', function ($scope, $rootScope, $http, $state, $stateParams, localStorageService, JSHelper, SERVER_CONFIG, Session, AuthService, AUTH_EVENTS, APP_STATES, AUTH_EVENTS_USER_FRIENDLY) {
    
    $rootScope.SetStateNavOptn("LOGIN", "login", "", 1);
    //globalFunctions();
    $scope.LandingMembershipState = true;

    if (!window.cordova) {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '319108068493877',
                status: false,
                cookie: true,
                xfbml: true
            });
            FB.Event.subscribe('auth.authResponseChange', function (response) { });
        };
        // Load the SDK asynchronously
        (function (d) {
            var js, id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = 'https://connect.facebook.net/en_US/all.js';
            ref.parentNode.insertBefore(js, ref);
        }(document));
    } ! function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }

    $scope.Login = function (credentials, form) {
        AuthService.login(credentials, form).then(function (user) {
            //console.log("login success");
            console.log(user);

            if (user != undefined) {
                //$state.go($stateParams.returnState, $stateParams.returnParams);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {
                    token: user
                });
                if($stateParams.returnState == 'app.home')
                {
                    if($rootScope.fromState.name == APP_STATES.reset_password_success){
                        $state.go('app.home');
                        return false;
                    }
                    $state.go($rootScope.fromState.name, $rootScope.stateParams);
                }
                else
                {
                    $state.go($stateParams.returnState);
                }
            }
            else {
                $('#loginForm .error-message').html('Invalid credentials. Please try again.');
                JSHelper.AlertForm(form, AUTH_EVENTS_USER_FRIENDLY.loginFailed);
            }
            // $scope.setCurrentUser(user);
        }, function () {
            console.log("login Failed");
            JSHelper.AlertForm(form, AUTH_EVENTS_USER_FRIENDLY.loginFailed);

            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    $scope.LoginWithFacebook = function (callback) {
        $scope.Facebook = function (response) {
            if (response.authResponse) {
                $http.post(SERVER_CONFIG.baseUrl + 'api/EndUsers/FacebookExternalLogin',
                    { accessToken: response.authResponse.accessToken }
                ).then(function successCallback(response) {
                    
                    if(response.data.userInfo != undefined){
                        Session.create(response.data.userInfo);
                        $state.go('app.register', {userInfo : response.data.userInfo});
                    }
                    else{
                        Session.create(response.data.token, '');            
                        localStorageService.set('basketId',response.data.user.basketId == 0 ? null : response.data.user.basketId);

                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {
                            token: response.data
                        });
                        if($stateParams.returnState == 'app.home')
                        {
                            $state.go($rootScope.fromState.name, $rootScope.stateParams);
                        }
                        else
                        {
                            $state.go($stateParams.returnState);
                        }                    
                    }
                }, function errorCallback(response) {
                    alert(JSON.stringify(response.data));
                });
            }
        }
        if (window.cordova) {
            facebookConnectPlugin.login(["public_profile", "email"], function (response) {
                $scope.Facebook(response);
            }, function () {
                //$rootScope.inProgress = false;
                //ngProgressLite.done();
            });
        } else {
            FB.login(function (response) {
                $scope.Facebook(response);
            }, {
                    scope: 'public_profile,email'
                });
        }
    }

    this.$onInit = function () {
        $("form#loginForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#loginForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#loginForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) { },
            submitHandler: function (form) {
                JSHelper.ResetForm();
                //$(form).find(".form__actions").addClass("loading");
                $scope.Login($scope.credentials, form);
            }
        });
    }

})

app.controller('Registration_Ctrl', function ($scope, $rootScope, $http, $timeout, $interval, $state, $stateParams, SERVER_CONFIG, JSHelper, MapHelper, Session, AUTH_EVENTS, localStorageService) {
    $scope.data = {}

    $scope.model = {
        regionId: ""
    };

    $scope.LandingMembershipState = true;

    $rootScope.SetStateNavOptn("REGISTER", "registration", "", 1);

    $scope.GetRegisterData = function () {
        $http({
            method: 'GET',
            url: SERVER_CONFIG.baseUrl + 'api/EndUsers/GetRegisterData'
        }).then(function (res) {
            $scope.data = res.data;
            //globalFunctions();
        });
    }

    $scope.userInfo = $stateParams.userInfo;

    if($scope.userInfo != null){
        $scope.model.firstName = $scope.userInfo.firstName;
        $scope.model.lastName = $scope.userInfo.lastName;
        $scope.model.UserName = $scope.userInfo.UserName;
        $scope.model.providerUserId = $scope.userInfo.providerUserId;
        $scope.userProvider = "Facebook";
        $scope.model.accessToken = $scope.userInfo.accessToken;
    }

    // $scope.FilterCities = function () {
    //     if ($scope.model.regionId != "" && $scope.model.regionId != null) {
    //         $http({
    //             method: 'GET',
    //             url: SERVER_CONFIG.baseUrl + 'api/Regions/GetSubRegion?id=' + $scope.model.regionId
    //         }).then(function (res) {
    //             console.log(res);
    //             $scope.data.subRegions = res.data.subRegions;
    //         });
    //     }
    // }

    //#region Map
    // $scope.woogoogle = false;
    // if ($scope.woogoogle == false) {
    //     var gogCounter = 0;
    //     var gogInt = $interval(function () {
    //         $scope.woogoogle = typeof (google) !== "undefined";
    //         if ($scope.woogoogle == false && gogCounter < 24) {
    //             gogCounter++;
    //         } else {
    //             $interval.cancel(gogInt);
    //             gogInt = null;
    //             gogCounter = null;
    //             MapHelper.GetCurrentLocation();
    //         }
    //     }, 500)
    // }
    //$scope.GetCurrentLocation = MapHelper.GetCurrentLocation;
    //$scope.GoToMarker = MapHelper.GoToMarker;
    //#endregion

    this.$onInit = function () {
        $scope.GetRegisterData();
        //globalFunctions();
        
        $("form#registrationForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#registrationForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#registrationForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     $('html, body').animate({
                //         scrollTop: $(firstEltFormRow).offset().top - 10 //- 58
                //     }, 1000);

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {
                //JSHelper.ResetForm();
                //if ($(form).valid() && $(form).find("[id='mobile']").valid()) {
                    //$(form).find(".form__actions").addClass("loading");
                    $http({
                        method: 'POST',
                        url: SERVER_CONFIG.baseUrl + 'api/EndUsers/Register',
                        data: $scope.model,
                    }).then(function (res) {
                        //$(form).find(".form__actions").removeClass("loading");
                        if (window.cordova) {
                            AddDeviceToOurDatabase(deviceToken, $scope.model.UserName);
                        }
                        console.log(res);
                        //Session.CreateByKey('euMobile', $scope.model.mobile);
                        //Session.CreateByKey('euUserName', $scope.model.UserName);
                        //$state.go('registrationverificationsms');
                        if(res.data.user != undefined){
                            //console.log("login success");
                            Session.create(res.data.token, '');  
                            localStorageService.set('basketId',res.data.user.basketId);   
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {
                                token: res.data
                            });
                            
                            $state.go('app.home');
                        }
                            // $scope.setCurrentUser(user);
                        else{
                            console.log("login Failed");
                            JSHelper.AlertForm(form, AUTH_EVENTS_USER_FRIENDLY.loginFailed);
                
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        }

                    }, function (res) {
                        JSHelper.AlertForm(form, res.data.message);
                    });
                    return false;
                //}

            }
        });
    }
})

app.controller('AddressBook_Ctrl', function ($scope, $http, $rootScope, $timeout, $state, $stateParams, $filter, Basket, Basket_EVENTS, SERVER_CONFIG){
    $scope.mySwiperAddress = "";
    $rootScope.SetStateNavOptn("ADDRESS BOOK", "addressbook", "", 1);

    $http.get(SERVER_CONFIG.baseUrl + "api/EndUsers/GetAddressBookData").then(function successCallback(response) {

        $scope.data = response.data;
        $timeout(function(){
            $scope.mySwiperAddress = swiperAddress();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $scope.SetAsDefaultAddress = function(id, isBilling){
        $http.post(SERVER_CONFIG.baseUrl + "api/EndUsers/SetAsDefaultAddress",{id : id, isBilling : isBilling}).then(function successCallback(response) {

            $scope.data = response.data;

            $timeout(function(){
                $scope.mySwiperAddress.update();
            }, 0);
    
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $rootScope.$on([Basket_EVENTS.addressRemoved], function (event, parameters) {
        $scope.data = parameters.address;
        $scope.mySwiperAddress.destroy(false, false);
        $timeout(function(){
            $scope.mySwiperAddress = swiperAddress();
        }, 500);
    });

    this.$onInit = function () {
        
    }
})

app.controller('AddAddress_Ctrl', function ($scope, $http, $rootScope, $timeout, $state, $stateParams, $filter, Basket, Basket_EVENTS, SERVER_CONFIG){

    $scope.model = {};

    $scope.isPayment = $stateParams.isPayment;

    $rootScope.SetStateNavOptn("ADD ADDRESS", "addaddress", "", 1);

    $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
        $scope.countries = Basket.returnBasket().countries;
        $scope.basket = Basket.returnBasket();
        if($scope.basket.userInfo != null){
            $scope.model = $scope.basket.userInfo;
        }
    });

    $timeout(function(){
    
        //globalFunctions();
        $("form#NewAddressForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#NewAddressForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#NewAddressForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {

                //$('.loader').addClass('show');
                //$(form).addClass('loading');

                $http.post(SERVER_CONFIG.baseUrl + "api/EndUsers/AddEditAddressBook", $scope.model).then(function successCallback(response) {

                    $scope.data = response.data;

                    if($scope.isPayment == "1"){
                        $state.go('app.payment');
                    }
                    else{
                        $state.go('app.addressbook');
                    }
            
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        });
        },100);

})

app.controller('EditAddress_Ctrl', function ($scope, $http, $rootScope, $timeout, $state, $stateParams, $filter, Basket, Basket_EVENTS, SERVER_CONFIG){

    $rootScope.SetStateNavOptn("EDIT ADDRESS", "editaddress", "", 1);

    $scope.isEdit = 1;

    $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
        $scope.countries = Basket.returnBasket().countries;
    });

    $http.post(SERVER_CONFIG.baseUrl + "api/EndUsers/GetAddressById",{id : $stateParams.id , isBilling : parseInt($stateParams.isBilling)}).then(function successCallback(response) {

        $scope.model = response.data;

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $timeout(function(){
    
        //globalFunctions();
        $("form#NewAddressForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#NewAddressForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#NewAddressForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {
                
                //$('.loader').addClass('show');
                //$(form).addClass('loading');

                $http.post(SERVER_CONFIG.baseUrl + "api/EndUsers/AddEditAddressBook", $scope.model).then(function successCallback(response) {

                    $scope.data = response.data;
                    $state.go('app.addressbook');
            
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        });
        },100);

})

app.controller('Remove_Address_Ctrl', function ($scope, $http, $rootScope, $timeout, $state, $stateParams, $filter, Basket, Basket_EVENTS, SERVER_CONFIG){

    $scope.RemoveAddress = function(id){
        $http.post(SERVER_CONFIG.baseUrl + "api/EndUsers/DeleteAddressBook",{id : id, isBilling : true}).then(function successCallback(response) {

            $scope.data = response.data;
            $rootScope.$broadcast(Basket_EVENTS.addressRemoved, {
                address : $scope.data
            });
            $.magnificPopup.close();

            $timeout(function(){

            }, 0);
    
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

})

app.controller('Send_Gift_Mail_Ctrl', function ($scope, $rootScope, $http, $timeout, $interval, $state, SERVER_CONFIG, JSHelper, MapHelper, Session, Basket_EVENTS, localStorageService) {

    $scope.model = {};


    this.$onInit = function () {
        //globalFunctions();
        $("form#SendGiftMailForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#SendGiftMailForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#SendGiftMailForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     $('html, body').animate({
                //         scrollTop: $(firstEltFormRow).offset().top - 10 //- 58
                //     }, 1000);

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {
                $scope.model.returnFullData = false;
                JSHelper.ResetForm();
                //if ($(form).valid() && $(form).find("[id='mobile']").valid()) {
                    //$(form).find(".form__actions").addClass("loading");
                    $http({
                        method: 'POST',
                        url: SERVER_CONFIG.baseUrl + 'api/MyCart/AssignShippingToBasket',
                        data: $scope.model,
                    }).then(function (res) {
                       console.log(res);   
                       $rootScope.$broadcast(Basket_EVENTS.mailGiftWrapped, { basket : res.data });
                       $.magnificPopup.close();
                    }, function (res) {
                        JSHelper.AlertForm(form, res.data.message);
                    });
                    return false;
                //}

            }
        });
    }
})

app.controller('Send_Gift_Address_Ctrl', function ($scope, $rootScope, $http, $timeout, $interval, $state, SERVER_CONFIG, Basket_EVENTS, JSHelper, MapHelper, Session,localStorageService) {

    $scope.model = {};


    this.$onInit = function () {
        //globalFunctions();
        $("form#SendGiftAddressForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#SendGiftAddressForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#SendGiftAddressForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     $('html, body').animate({
                //         scrollTop: $(firstEltFormRow).offset().top - 10 //- 58
                //     }, 1000);

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {
                $scope.model.returnFullData = false;
                JSHelper.ResetForm();
                //if ($(form).valid() && $(form).find("[id='mobile']").valid()) {
                    //$(form).find(".form__actions").addClass("loading");
                    $http({
                        method: 'POST',
                        url: SERVER_CONFIG.baseUrl + 'api/MyCart/AssignShippingToBasket',
                        data: $scope.model,
                    }).then(function (res) {
                       console.log(res);   
                       $rootScope.$broadcast(Basket_EVENTS.addressGiftWrapped, { basket : res.data });
                       $.magnificPopup.close();
                    }, function (res) {
                        JSHelper.AlertForm(form, res.data.message);
                    });
                    return false;
                //}

            }
        });
    }
});

app.controller('Remove_Gift_Ctrl', function ($scope, $rootScope, $http, $timeout, $interval, $state, SERVER_CONFIG, JSHelper, MapHelper, Session, Basket_EVENTS, localStorageService) {

    $scope.model = {};
    $scope.address = {};

    $scope.RemoveGiftWrap = function(){

        $http.post(SERVER_CONFIG.baseUrl + 'api/MyCart/RemoveGiftFromBasket').then(function successCallback(response) {
                console.log(response);
                if (response.status == 200) {
                    $scope.basket = response.data;
                    $rootScope.$broadcast(Basket_EVENTS.removeGiftBasket, { basket: $scope.basket });
                    $.magnificPopup.close();
                }
            });
    }


    this.$onInit = function () {
        //globalFunctions();
    }
})

app.controller('MyCartController', function ($http, $rootScope, $scope, $state, $stateParams, $httpParamSerializer, $timeout, localStorageService, SERVER_CONFIG, Basket, Basket_EVENTS, storageService) {
    //globalFunctions();
    $rootScope.SetStateNavOptn("MY CART", "mycart", "", 1);

    $scope.openGiftModal = angular.copy($stateParams.openGiftModal);

    $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
        $scope.basket = Basket.returnBasket();
        if($scope.openGiftModal == "1"){
            $timeout(function(){
                $('.panel.panel-gift').click();
            }, 0);
        }
    });

    $rootScope.$on(Basket_EVENTS.currencyChanged, function (event, parameters) {
        $scope.currentCurrency = parameters.currentCurrency;
    });

    $rootScope.$on([Basket_EVENTS.mailGiftWrapped], function (event, parameters) {
        $scope.basket = parameters.basket;
    });

    $rootScope.$on([Basket_EVENTS.addressGiftWrapped], function (event, parameters) {
        $scope.basket = parameters.basket;
    });

    $rootScope.$on([Basket_EVENTS.removeGiftBasket], function (event, parameters) {
        $scope.basket = parameters.basket;
    });

    /*#region Storage Comment
        // if (window.cordova) {
        //     plugins.appPreferences.fetch(function (result) {

        //         $scope.currentCurrency = result;

        //     }, function () { }, 'currentCurrency');
        // }
        // else {
        //     var localStorageCurrency = localStorageService.get('currentCurrency');
        //     $scope.currentCurrency = localStorageCurrency;
        // }
    #endregion*/

    var localStorageCurrency = storageService.GetStorage('currentCurrency');
    $scope.currentCurrency = localStorageCurrency;


    $scope.RemoveItemFromBasket = function (item) {
        $scope.itemToDelete = {
            productId: 0,
            SizeInBasketId: 0
        };

        $scope.itemToDelete.productId = item.id;
        $scope.itemToDelete.SizeInBasketId = item.SizeInBasketId;
        $scope.itemToDelete.EkomProductBasketId = item.EkomProductBasketId;

        $rootScope.$broadcast(Basket_EVENTS.removeItemBasket, { itemToDelete: $scope.itemToDelete });
    }

    $scope.RemoveGiftWrap = function(){

        $http.post(SERVER_CONFIG.baseUrl + 'api/MyCart/RemoveGiftFromBasket').then(function successCallback(response) {
                console.log(response);
                if (response.status == 200) {
                    $scope.basket = response.data;
                    $scope.removeItemOpened = false;
                    $rootScope.$broadcast(Basket_EVENTS.removeItemBasketConfirmed, { basket: $scope.basket });
                    $scope.BasketCount = $scope.basket.products.length;
                }

                $scope.itemToDelete = {
                    productId: 0,
                    SizeInBasketId: 0
                };

            });

    }

    $scope.confirmRemoveItem = function (item) {
        $http.post(SERVER_CONFIG.baseUrl + 'api/MyCart/RemoveFromBasket', item).then(function successCallback(response) {
                console.log(response);
                if (response.status == 200) {
                    $scope.basket = response.data;
                    $scope.removeItemOpened = false;
                    $rootScope.$broadcast(Basket_EVENTS.removeItemBasketConfirmed, { basket: $scope.basket });
                    $scope.BasketCount = $scope.basket.products.length;
                }

                $scope.itemToDelete = {
                    productId: 0,
                    SizeInBasketId: 0
                };

            });
    }

    $scope.UpdateSize = function (direction, item) {

        $scope.updateItem = angular.copy(item);

        $scope.updateItem.ekomProductId = $scope.updateItem.id;

        if(direction == 'up'){
            $scope.updateItem.quantity++;
        }
        else{
            $scope.updateItem.quantity--;
        }

        $http.post(SERVER_CONFIG.baseUrl + 'api/MyCart/UpdateProductInBasket', $scope.updateItem).then(function successCallback(response) {
            basket = response.data;

            $rootScope.$broadcast(Basket_EVENTS.itemAdded, { myBag: basket });
        });
    }

    this.$onInit = function () {

    }
});

app.controller('Password_Forgot_Ctrl', function ($scope, $rootScope, $http, $state, JSHelper, SERVER_CONFIG) {
    $scope.model = {};
    $rootScope.SetStateNavOptn("FORGOT PASSWORD", "forgetPassword", "#!/login", 1);

    this.$onInit = function () {
        // Helper.InitializeFastClick();
        //globalFunctions();

        $("form#forgotPassForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#forgotPassForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#forgotPassForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            submitHandler: function (form) {
                JSHelper.ResetForm();
                //$(form).find(".form__actions").addClass("loading");
                $http({
                    method: 'POST',
                    url: SERVER_CONFIG.baseUrl + 'api/EndUsers/ForgotPassword',
                    data: $scope.model,
                }).then(function (res) {
                    $state.go('app.forgotpasswordsuccess');
                }, function (res) {
                    $(form).find(".form__actions").removeClass("loading");
                    $(form).find(".error-message").eq(0).html(res.data.message);
                    //JSHelper.AlertForm(form, res.data.message);
                });
                return false;
            }
        });
    }

})

app.controller('ResetPassController', function ($http, $rootScope, $scope, $state, $stateParams, SERVER_CONFIG) {
    //globalFunctions();
    $scope.model = {};

    $scope.token = $stateParams.resetpassword;
    $scope.email = $stateParams.email;

    $("form#frmResetPass").validate({
        errorClass: "form-invalid",
        ignore: "",
        errorPlacement: function (error, element) {
            
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
            $("form#frmResetPass").parent().removeClass(validClass).addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
            $("form#frmResetPass").parent().removeClass(validClass).addClass(errorClass);
        },
        rules: {},
        messages: {},
        submitHandler: function (form) {
            $http({
                method: 'POST',
                url: SERVER_CONFIG.baseUrl + 'api/EndUsers/ResetPassword',
                data: {
                    UserName: $stateParams.email,
                    NewPassword: $scope.model.NewPassword,
                    token: $scope.token,
                },
            }).then(function (res) {
                $state.go('app.resetpasssuccess');
            }, function (res) {
                //JSHelper.AlertForm(form, res.data.message);
            });

        }
    });

});

app.controller('Password_Forgot_Success_Ctrl', function ($scope, $rootScope, $http, JSHelper) {

    $rootScope.SetStateNavOptn("", "forgetPassword", "#!/dashboard", 1);
    $scope.backUrl = $rootScope.navigationOpt.backUrl;
    $scope.GoToState = JSHelper.GoToState;

})

app.controller('Password_Reset_Ctrl', function ($scope, $rootScope, $http, $state, $stateParams, JSHelper, SERVER_CONFIG) {
    $scope.model = {};
    $rootScope.SetStateNavOptn("", "resetPassword", "#!/dashboard", 1);
    $("form#resetPassForm").validate({
        errorClass: "form-error",
        ignore: "",
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.form__controls').removeClass(errorClass).addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.form__controls').removeClass(errorClass).addClass(validClass);
        },
        rules: {
        },
        messages: {},
        submitHandler: function (form) {
            JSHelper.ResetForm();
            //$(form).find(".form__actions").addClass("loading");
            $http({
                method: 'POST',
                url: SERVER_CONFIG.baseUrl + 'api/EndUsers/ResetPassword',
                data: {
                    UserName: $stateParams.email,
                    NewPassword: $scope.model.NewPassword,
                    token: $stateParams.token,
                },
            }).then(function (res) {
                $state.go('resetpasswordsuccess');
            }, function (res) {
                JSHelper.AlertForm(form, res.data.message);
            });
        }
    });
})

app.controller('Password_Reset_Success_Ctrl', function ($scope, $rootScope, $http, JSHelper) {

    $rootScope.SetStateNavOptn("", "resetPassword", "#!/dashboard", 1);
    $scope.backUrl = $rootScope.navigationOpt.backUrl;
    $scope.GoToState = JSHelper.GoToState;

})

app.controller('Registration_Verification_Email_Ctrl', function () {

})

app.controller('Registration_Verification_Sms_Ctrl', function ($scope, $timeout, $http, $state, SERVER_CONFIG, JSHelper, Session) {
    $scope.model = {
        mobile: Session.euMobile,
        userName: Session.euUserName
    };
    $scope.canSendSMS = true;
    $scope.timerRunning = false;
    $scope.timer1 = null;

    var verificationTimeout = 120000;
    var verificationPluginTimeout = 120;

    // var verificationTimeout = 30000;
    // var verificationPluginTimeout = 30;

    $scope.startTimer = function () {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.stopTimer = function () {
        $scope.$broadcast('timer-stop');
        $scope.timerRunning = false;
    };

    $scope.resetTimer = function () {
        // $scope.$broadcast('timer-clear');
        // $scope.$broadcast('timer-add-cd-seconds', 120 );
        $scope.$broadcast('timer-set-countdown-seconds', verificationPluginTimeout);
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.$on('timer-stopped', function (event, data) {
        console.log('Timer Stopped - data = ', data);
    });

    $scope.ResendCode = function () {
        if ($scope.canSendSMS) {
            $scope.canSendSMS = false;
            $http({
                method: 'POST',
                url: SERVER_CONFIG.baseUrl + 'api/EndUsers/SendRegistrationVerificationCode',
                data: {
                    mobile: $scope.model.mobile,
                    username: $scope.model.userName
                },
            }).then(function (res) {
                // $("#verificationCode-row").slideDown();                
                console.log("ResendCode");
                $scope.resetTimer();
                $timeout.cancel($scope.timer1);
                $scope.timer1 = $timeout(function () {
                    $scope.canSendSMS = true;
                }, verificationTimeout);
            }, function (res) {
                $scope.canSendSMS = true;
                JSHelper.ShowAlert(res.data);
            });
        }
    }

    this.$onInit = function () {

        $("form#registrationSMSValidationForm").validate({
            errorClass: "form-error",
            ignore: "",
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__controls').removeClass(errorClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__controls').removeClass(errorClass).addClass(validClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) { },
            submitHandler: function (form) {
                JSHelper.ResetForm();
                //$(form).find(".form__actions").addClass("loading");
                $http({
                    method: 'POST',
                    url: SERVER_CONFIG.baseUrl + 'api/EndUsers/ValidateRegistrationMobileNumber',
                    data: $scope.model,
                }).then(function (res) {
                    Session.DeleteByKey('euMobile');
                    Session.DeleteByKey('euUserName');
                    $state.go('login');
                }, function (res) {
                    JSHelper.AlertForm(form, res.data.message);
                });
                return false;
            }
        });
    }

})

app.controller('Auto_Login_Ctrl', function () {

})
//#endregion


app.controller('Home_Ctrl', function ($scope, $http, $rootScope, $sce, SERVER_CONFIG, ARTICLE_CATEGORY_IDS) {

    $rootScope.SetStateNavOptn("MY CART", "home", "", 1);
    $scope.templates = ARTICLE_CATEGORY_IDS;
    this.$onInit = function () {  

    }

    $http.get(SERVER_CONFIG.baseUrl + "api/Data/GetHomeData").then(function successCallback(response) {

        $scope.data = response.data;
        $http.get(SERVER_CONFIG.baseUrl + "api/Data/GetHomeBottomData").then(function successCallback(response) {

            $scope.homeBottom = response.data;
            setTimeout(function(){
                InitSwiperInquiry();
                InitSwiperOpinion();
                InitSwiperBlog();
                InitSwiperVideo();
                InitSwiperLeader();
                navigator.splashscreen.hide();
            }, 0);
    
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
        setTimeout(function(){
            //navigator.splashscreen.hide();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
})

app.controller('ArticleDetails_Ctrl', function ($scope, $http, $rootScope, $stateParams, $sce, SERVER_CONFIG, ARTICLE_CATEGORY_IDS) {

    //$rootScope.SetStateNavOptn("MY CART", "home", "", 1);
    $rootScope.bodyClass = "ArticleDetailPage";
    $scope.slideCount = 0;
    $scope.videoIndex = -1;
    $scope.picIndex = -1;
    this.$onInit = function () {  

    }

    $http.get(SERVER_CONFIG.baseUrl + "api/Data/GetArticleDetails?id="+ $stateParams.id).then(function successCallback(response) {

        $scope.data = response.data;
        angular.forEach($scope.data.article.media, function(item){
            if(item.mediaType == 1 && $scope.picIndex == -1){
                $scope.picIndex = $scope.slideCount;
            }
            if(item.mediaType == 2 && $scope.videoIndex == -1){
                $scope.videoIndex = $scope.slideCount;
            }
            $scope.slideCount++;
        })
        setTimeout(function(){
            InitSwiperPartnerCompanies();
            InitSwiperRelatedArticles();
            InitSwiperPopup();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
})

app.controller('ArticleCategory_Ctrl', function ($scope, $http, $rootScope, $stateParams, $sce, SERVER_CONFIG, CATEGORY_IDS) {

    //$rootScope.SetStateNavOptn("MY CART", "home", "", 1);
    $rootScope.bodyClass = "";
    $scope.videoCategoryId = CATEGORY_IDS.video;
    $scope.homefourCategoryId = CATEGORY_IDS.homepage_four_category_id;
    $scope.countryCategoryId = CATEGORY_IDS.article_category_country_id;
    $scope.currentCategoryId = $stateParams.id;

    $scope.filterCategory = angular.copy($stateParams.id)+"";
    $scope.filterSubCategory = angular.copy($stateParams.subcategoryId)+"";
    $scope.filterCountry = angular.copy($stateParams.countryId)+"";

    $scope.applyFilters = function(categoryId, subcategoryId, countryId){

        $http.get(SERVER_CONFIG.baseUrl + "api/Data/GetCategoryData?categoryId="+categoryId+"&subcategoryId="+subcategoryId+"&countryId="+countryId).then(function successCallback(response) {

            $scope.data = response.data;
            setTimeout(function(){
                InitSwiperPartnerCompanies();
            }, 0);

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }
    

    this.$onInit = function () {  
        $scope.applyFilters($stateParams.id, $stateParams.subcategoryId, $stateParams.countryId);
    }
})

app.controller('AboutUs_Ctrl', function ($scope, $http, $rootScope, SERVER_CONFIG) {

    $rootScope.SetStateNavOptn("ABOUT US", "aboutus", "", 1);

    $http.get(SERVER_CONFIG.baseUrl + "api/about/GetAll").then(function successCallback(response) {

        $scope.data = response.data;

        setTimeout(function(){
            initSwipers();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
})

app.controller('ContactUs_Ctrl', function ($scope, $http, $rootScope, SERVER_CONFIG) {
    $rootScope.SetStateNavOptn("CONTACT US", "contact", "", 1);
    $http.get(SERVER_CONFIG.baseUrl + "api/contactus/GetAll").then(function successCallback(response) {

        $scope.data = response.data;

        setTimeout(function(){
            initSwipers();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
})

app.controller('LocateUs_Ctrl', function ($scope, $http, $rootScope, $timeout, $state, $stateParams, $filter, Basket, Basket_EVENTS, SERVER_CONFIG){

    $rootScope.SetStateNavOptn("LOCATE US", "locateus", "", 1);

    $scope.isIOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";
    $scope.isAndroid = device.platform == "Android";
})

app.controller('MessageUs_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, SERVER_CONFIG, Basket, Basket_EVENTS){

    $scope.model = {};

    $rootScope.SetStateNavOptn("MESSAGE US", "messageus", "", 1);
    //globalFunctions();

    $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
        $scope.basket = Basket.returnBasket();

        if($scope.basket.userInfo != null){
            $scope.model.firstName = $scope.basket.userInfo.firstName;
            $scope.model.lastName = $scope.basket.userInfo.lastName;
            $scope.model.email = $scope.basket.userInfo.email;
            //globalFunctions();
        }
    });

    $http.get(SERVER_CONFIG.baseUrl + "api/contactus/GetInquiryTypes").then(function successCallback(response) {

        $scope.data = response.data;

        setTimeout(function(){
            initSwipers();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $("form#MessageUsForm").validate({
        errorClass: "form-invalid",
        errorPlacement: function (error, element) {
            
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
            $("form#MessageUsForm").parent().removeClass(validClass).addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
            $("form#MessageUsForm").parent().removeClass(validClass).addClass(errorClass);
        },
        rules: {
            firstName: { required: true },
            lastName: { required: true },
            inquiryTypeId: { required: true },
            email: { required: true, email: true },
            message: { required: true },
        },
        messages: {
        },
        submitHandler: function (form) {

            var data = $(form).serialize();
            //$('.loader').addClass('show');
            //$(form).addClass('loading');

            $.ajax({
                url: SERVER_CONFIG.baseUrl + "api/contactus/Send",
                type: "post",
                data: data,
                success: function (result) {
                    $state.go('app.thankyou');
                }
            });


            return false;
        }
    });
})

app.controller('MessageThankYou_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $timeout, SERVER_CONFIG){
    $rootScope.SetStateNavOptn(" ", "aboutus", "", 1);

    $timeout(function(){
        $state.go('app.messageus');
    }, 6000);
})

app.controller('ProductsDetails_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $filter, $timeout, Basket, Basket_EVENTS, SERVER_CONFIG){

    $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
        $scope.basket = Basket.returnBasket();
        //$('html,body').animate({ scrollTop: 0 }, 700);
    });

    $scope.goBack = function() {
        window.history.back();
    };

    $scope.productItem = {};
    $rootScope.SetStateNavOptn(" ", "proddetails", "", 1);
    $scope.addToBasket = Basket.addToBasket;

    $http.get(SERVER_CONFIG.baseUrl + "api/ekomproducts/GetProductById?id=" + $stateParams.id).then(function successCallback(response) {

        $scope.data = response.data;

        $scope.productItem.ekomProductId = $scope.data.id;
        $scope.productItem.quantity = 1;

        $rootScope.SetStateNavOptn($filter('uppercase')($scope.data.title), "proddetails", "", 1);
        setTimeout(function(){
            initSwipers();
        }, 0);
        //navTrigger();

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $scope.ClearAndWrapBasket = function(){
        $http.post(SERVER_CONFIG.baseUrl + "api/MyCart/ClearBasket", {ekomProductId : $scope.data.id, quantity : 1 }).then(function successCallback(response) {

            $scope.basket = response.data;

            $rootScope.$broadcast(Basket_EVENTS.itemAdded, { myBag: response.data });
            $state.go('app.mycart', {openGiftModal : 1});

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    this.$onInit = function () {

    }
    
})

app.controller('ProductListing_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $filter, SERVER_CONFIG){
    $rootScope.SetStateNavOptn(" ", "prodlisting", "", 1);
    $http.get(SERVER_CONFIG.baseUrl + "api/ekomcategories/GetProductByCategoryId?id="+$stateParams.id).then(function successCallback(response) {

        $scope.data = response.data;
        $rootScope.SetStateNavOptn($filter('uppercase')($scope.data.title), "prodlisting", "", 1);
        setTimeout(function(){
            initSwipers();
        }, 0);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
})

app.controller('ShippingPayment_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $filter, $timeout, PaymentFactory, Basket, SERVER_CONFIG, Basket_EVENTS){

    $scope.model = {};

    $scope.model.billingEntry = {};

    $rootScope.SetStateNavOptn("BILLING & PAYMENT", "billingpayment", "", 1);
    

    $rootScope.$on([Basket_EVENTS.itemAdded], function (event, parameters) {
        $scope.countries = Basket.returnBasket().countries;
        $scope.addresses = Basket.returnBasket().userAddresses;
        $scope.basket = Basket.returnBasket();

        $scope.model.billingEntry.billingFirstName = $scope.basket.userInfo.firstName;
        $scope.model.billingEntry.billingLastName = $scope.basket.userInfo.lastName;
        $scope.model.billingEntry.billingEmail = $scope.basket.userInfo.email;
        $scope.model.billingEntry.billingCountryId = $scope.basket.userInfo.countryId+"";
        $scope.model.billingEntry.billingcityState = $scope.basket.userInfo.city;
        $scope.model.billingEntry.billingAddress = $scope.basket.userInfo.address;

        if($scope.addresses != null){
            angular.forEach($scope.addresses.billingAddresses, function (entry) {
                if(entry.defaultAddress){
                    $scope.model.eKomBillingId = entry.id;
                }
            });
        }

        $timeout(function(){
    
        //globalFunctions();
        $("form#shippingPaymentForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#shippingPaymentForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#shippingPaymentForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {},
            messages: {},
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {
                $('#loaderDivForced').addClass('show');
                $('.BlockSubmit').addClass('active');
                $(".BlockSubmit ~ a").html('Submitting...');
                //JSHelper.ResetForm();
                    // $(form).find(".form__actions").addClass("loading");
                    // $http({
                    //     method: 'POST',
                    //     url: SERVER_CONFIG.baseUrl + 'api/MyCart/Ecommerce',
                    //     data: $scope.$$childTail.model,
                    // }).then(function (res) {
                    //     $(form).find(".form__actions").removeClass("loading");
                    //     // $state.go('registrationverificationsms');
                    // }, function (res) {
                    //     //JSHelper.AlertForm(form, res.data.message);
                    // });
                    // return false;
                    PaymentFactory.GetCheckoutConfiguration($scope.model).then(function(){
                        PaymentFactory.UseNewCreditCard('app.receipt');
                    }, function(error){
                        alert();
                        $('#loaderDivForced').removeClass('show');
                    }
                );
                    

            }
        });
        },100);
    });

    this.$onInit = function () {


    }
    
})

app.controller('Orders_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $filter, $timeout, PaymentFactory, Basket, SERVER_CONFIG, Basket_EVENTS){

    $rootScope.SetStateNavOptn("MY ORDERS", "myorders", "", 1);

    $http.get(SERVER_CONFIG.baseUrl + "api/mycart/GetMyOrdersData").then(function successCallback(response) {
        $scope.data = response.data;
        console.log(response.data);
        // var subTotal = 0;
        // angular.forEach($scope.data.products, function(item){
        //     subTotal += item.price;
        //     $scope.data.subTotal = subTotal;
        // });
    });

    this.$onInit = function () {


    }
    
})

app.controller('OrderDetails_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $filter, $timeout, PaymentFactory, Basket, SERVER_CONFIG, Basket_EVENTS){

    $rootScope.SetStateNavOptn("RECEIPT", "receipt", "", 1);

    $scope.openInApp = function(link){
        var ref = cordova.InAppBrowser.open(link, '_self', 'location=no');
    }

    $http.get(SERVER_CONFIG.baseUrl + "api/mycart/GetOrderDetailsData", {
        params: { id: $stateParams.id }
    }).then(function successCallback(response) {
        $scope.data = response.data;
        console.log(response.data);
        // var subTotal = 0;
        // angular.forEach($scope.data.products, function(item){
        //     subTotal += item.price;
        //     $scope.data.subTotal = subTotal;
        // });
    });

    $scope.generatePDF = function(){
        $('#loaderDiv').show();
        let options = {
            documentSize: 'A4',
            type: 'share',
            fileName: 'leroyalReceipt.pdf'
          }
        pdf.fromData( $('html').html(), options)
        .then(function(){
            $('#loaderDiv').hide();
        })   // ok..., ok if it was able to handle the file to the OS.  
        .catch(function(){
            $('#loaderDiv').hide();
        })
    }

    this.$onInit = function () {


    }
    
})

app.controller('ProductsTerms_Ctrl', function ($scope, $http, $rootScope, $state, $stateParams, $filter, $timeout, PaymentFactory, Basket, SERVER_CONFIG, Basket_EVENTS){

    if($stateParams.id == 33){
        $rootScope.SetStateNavOptn("TERMS & CONDITIONS", "terms-blue", "", 1);
    }
    else{
        $rootScope.SetStateNavOptn("TERMS & CONDITIONS", "terms-brown", "", 1);
    }

    $http.get(SERVER_CONFIG.baseUrl + "api/ekomproducts/GetTermsById?id="+$stateParams.id).then(function successCallback(response) {
        $scope.data = response.data;
        // var subTotal = 0;
        // angular.forEach($scope.data.products, function(item){
        //     subTotal += item.price;
        //     $scope.data.subTotal = subTotal;
        // });
    });

    this.$onInit = function () {


    }
    
})

app.controller('Edit_profile_Ctrl', function ($scope, $rootScope, AuthService, $interval, $timeout, $http, SERVER_CONFIG, JSHelper, MapHelper, MAP_DEFAULT_LOCATION) {
    $scope.data = {};
    $scope.model = {};
    $scope.modelPassword = {};

    $rootScope.SetStateNavOptn("EDIT PROFILE", "editProfile", "", 1, "header--blue-light");

    $scope.logout = function () {
        AuthService.logout();
    };

    // $scope.FilterCities = function () {
    //     if ($scope.model.regionId != "" && $scope.model.regionId != null) {
    //         $http({
    //             method: 'GET',
    //             url: SERVER_CONFIG.baseUrl + 'api/Regions/GetSubRegion?id=' + $scope.model.regionId
    //         }).then(function (res) {
    //             console.log(res);
    //             $scope.data.subRegions = res.data.subRegions;
    //         });
    //     }
    // }

    $scope.GetAccountData = function () {
        $http({
            method: 'GET',
            url: SERVER_CONFIG.baseUrl + 'api/EndUsers/GetEditAccountInfo'
        }).then(function (res) {
            console.log(res);
            $scope.model = res.data.model;
            $scope.countries = res.data.countries;
            // $scope.model.googleMapsCoordsLatitude = $scope.model.googleMapsCoordsLatitude || MAP_DEFAULT_LOCATION.lattitude;
            // $scope.model.googleMapsCoordsLongitude = $scope.model.googleMapsCoordsLongitude || MAP_DEFAULT_LOCATION.longitude;
            // $scope.model.googleMapsZoom = MAP_DEFAULT_LOCATION.zoom;

            // $scope.data.regions = res.data.regions;
            // $scope.data.subRegions = res.data.subRegions;
            // $scope.data.contactTitles = res.data.contactTitles;

        });
    }

    //#region Map
    // $scope.woogoogle = false;
    // if ($scope.woogoogle == false) {
    //     var gogCounter = 0;
    //     var gogInt = $interval(function () {
    //         $scope.woogoogle = typeof (google) !== "undefined";
    //         if ($scope.woogoogle == false && gogCounter < 24) {
    //             gogCounter++;
    //         } else {
    //             $interval.cancel(gogInt);
    //             gogInt = null;
    //             gogCounter = null;
    //             MapHelper.GetCurrentLocation();
    //         }
    //     }, 500)
    // }
    // $scope.GetCurrentLocation = MapHelper.GetCurrentLocation;
    // $scope.GoToMarker = MapHelper.GoToMarker;
    //#endregion

    this.$onInit = function () {
        $scope.GetAccountData();
        //globalFunctions();
        $("form#editProfileForm").validate({
            errorClass: "form-invalid",
            ignore: "",
            errorPlacement: function (error, element) {
                
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(validClass).addClass(errorClass);
                $("form#editProfileForm").parent().removeClass(validClass).addClass(errorClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form__row').removeClass(errorClass).addClass(validClass);
                $("form#editProfileForm").parent().removeClass(validClass).addClass(errorClass);
            },
            rules: {
                Password: {
                    required: function(element){
                            return $("#field-new-password").val()!="";
                        }
                },
                ConfirmNewPassword: {
                    equalTo: "#editProfileForm #field-new-password",
                }
            },
            messages: {
                ConfirmNewPassword: {
                    equalTo: "Passwords do not match"
                },
            },
            invalidHandler: function (form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {
                //     var firstElt = validator.errorList[0].element;
                //     var firstEltFormRow = $(firstElt).parents(".col");

                //     $('html, body').animate({
                //         scrollTop: $(firstEltFormRow).offset().top - 10 //- 58
                //     }, 1000);

                //     validator.errorList[0].element.focus();
                // }
            },
            submitHandler: function (form) {
                JSHelper.ResetForm();
                if ($(form).valid()) {
                    //$(form).find(".form__actions").addClass("loading");
                    $http({
                        method: 'POST',
                        url: SERVER_CONFIG.baseUrl + 'api/EndUsers/EditAccountInfo',
                        data: $scope.model,
                    }).then(function (res) {
                        $('#field-new-password').val('');
                        $('#field-confirm-password').val('');
                        $(form).find(".form__actions").removeClass("loading");
                        $(form).find('.error-message').eq(0).html('Profile updated successfully!');
                        $(form).addClass('success');
                        $timeout(function(){
                            $(form).removeClass('success');
                        }, 3000);
                        $rootScope.FetchUserInfos();
                        if (window.cordova) {
                            AddDeviceToOurDatabase(deviceToken, $scope.model.UserName);
                        }
                        // $state.go('registrationverificationsms');
                    }, function (res) {
                        $(form).find(".form__actions").removeClass("loading");
                        $(form).find('.error-message').eq(0).html('An error occured!');
                        $(form).addClass('success');
                        $timeout(function(){
                            $(form).removeClass('success');
                        }, 3000);
                        //JSHelper.AlertForm(form, res.data.message);
                    });
                    return false;
                }

            }
        });

        // $("form#editPasswordForm").validate({
        //     errorClass: "form-error",
        //     ignore: "",
        //     highlight: function (element, errorClass, validClass) {
        //         $(element).parents('.form__controls').removeClass(errorClass).addClass(errorClass);
        //     },
        //     unhighlight: function (element, errorClass, validClass) {
        //         $(element).parents('.form__controls').removeClass(errorClass).addClass(validClass);
        //     },
        //     rules: {
        //         ConfirmNewPassword: {
        //             equalTo: "#editPasswordForm #field-new-password",
        //         }
        //     },
        //     messages: {
        //         ConfirmNewPassword: {
        //             equalTo: "Passwords do not match"
        //         },
        //     },
        //     submitHandler: function (form) {
        //         $(form).find(".form__actions").addClass("loading");
        //         $http({
        //             method: 'POST',
        //             url: SERVER_CONFIG.baseUrl + 'api/EndUsers/UpdatePassword',
        //             data: $scope.modelPassword,
        //         }).then(function (res) {
        //             $(form).find(".form__actions").removeClass("loading");
        //             $rootScope.FetchUserInfos();
        //             // $state.go('app.editaccountpasswordsuccess');
        //         }, function (res) {
        //             JSHelper.AlertForm(form, res.data.message);
        //         });
        //     }
        // });

    }

})