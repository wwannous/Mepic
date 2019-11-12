app.factory('AuthService', function ($rootScope, $http, $state, $timeout, Session, localStorageService, AUTH_EVENTS, SERVER_CONFIG, JSHelper) {
    var authService = {};
    authService.login = function (credentials, form) {
        console.log(credentials);
        return $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + 'api/EndUsers/login',
            // transformRequest: function (obj) {
            //     var str = [];
            //     for (var p in obj)
            //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //     return str.join("&");
            // },
            data: credentials,
        }).then(function (res) {
            console.log(res);
            Session.create(res.data.token, '');            
            localStorageService.set('basketId',res.data.user.basketId == 0 ? null : res.data.user.basketId);            
            return res.data;
        }, function (res) {
            $(form).find(".form__actions").removeClass("loading");
            JSHelper.AlertForm(form, res.data.token.error_description);

        });
    };
    authService.checktoken = function (type) {
        var type = type ? type : "";
        var url = type == 'error' ? SERVER_CONFIG.baseUrl + 'api/administrators/badtoken' :
            SERVER_CONFIG.baseUrl + 'api/administrators/checktoken';
        return $http({
            method: 'POST',
            url: url,
        })
            .then(function (res) {
                return res.data;
            }, function () {
                console.log('handle rejection ');

            });
    };

    authService.logout = function () {
        $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + 'api/account/logout',
            // transformRequest: function (obj) {
            //   var str = [];
            //   for (var p in obj)
            //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //   return str.join("&");
            // },
            data: {},
        }).then(function (res) {       
            return res.data;
        });
        $timeout(
            function(){
                Session.destroy();
                localStorageService.remove("basketId"); 
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $state.transitionTo("app.home");
            }, 100
        );
    };
    authService.isAuthenticated = function () {

        if (localStorageService.isSupported) {
            if (localStorageService.get('token')) {
                return true;
            }
        } else {
            console.log('localStorageService.NOTSupported');
        }

        return !!Session.userId;
    };
    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
            (authorizedRoles.indexOf(Session.userRole) !== -1 ||
                authorizedRoles[0] == "*")
        );
    };

    authService.UpdateLastLogin = function () {
        var lastLoginCredentials = {};
        if (device) {
            lastLoginCredentials.deviceOsPlatform = device.platform;
            lastLoginCredentials.deviceOsVersion = device.version;
            lastLoginCredentials.deviceManufacturer = device.manufacturer;
            lastLoginCredentials.deviceModel = device.model;
            lastLoginCredentials.appVersion = appVersion;
        }
        else {
            lastLoginCredentials.appOs = "Desktop";
            lastLoginCredentials.appVersion = "";
        }

        $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + '/api/EndUsers/UpdateLastLogin',
            data: lastLoginCredentials
        });
    }

    return authService;
});

app.factory('AuthInterceptor', function ($rootScope, $q, $state, Session, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            response.status = response.status == -1 ? (response.config.method == "POST" ? 1 : response.config.method == "GET" ? 2 : 0) : 0;
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout,
                404: AUTH_EVENTS.ressourceNotFound,
                500: AUTH_EVENTS.serverError,
                1: AUTH_EVENTS.networkErrorPosting,
                2: AUTH_EVENTS.networkErrorGetting
            }[response.status], response);
            console.log('AuthInterceptor response');
            console.log(response);
            $rootScope.hasNetworkError = true;
            return $q.reject(response);
        }
    };
});

app.factory('sessionInjector', function (Session, SESSION_CONFIG,localStorageService) {
    var sessionInjector = {
        request: function (config) {
            if (Session.token_type && Session.access_token) {
                config.headers['Authorization'] = Session.token_type + " " + Session.access_token;
            }
            config.headers['User-Origin'] = SESSION_CONFIG.headers_user_origin;
            config.headers['basket-id'] = localStorageService.get("basketId");
            return config;
        }
    };
    return sessionInjector;
});

app.factory('AuthResolver', function ($q, $http, $rootScope, $state, Session, SERVER_CONFIG) {
    return {
        resolve: function () {
            if (angular.isDefined(Session.userInfos) && Session.userInfos) {
                console.log("AuthResolver");
                console.log(Session);
                return Session.userInfos;
            } else {
                var deferred = $q.defer();
                var dataToSend = {
                    deviceOsVersion: window.device != undefined ? window.device.platform : "",
                    appVersion: appVersion
                }
                $http({
                    method: 'POST',
                    url: SERVER_CONFIG.baseUrl + 'api/EndUsers/getuserinfo',
                    data: dataToSend
                }).then(function (res) {
                    console.log("AuthResolver : getuserinfo");
                    console.log(res.data);
                    deferred.resolve(res.data);
                    Session.userInfos = res.data;
                    if (window.cordova) {
                        AddDeviceToOurDatabase(deviceToken, res.data.user.userName);
                    }
                }, function (error) {
                    console.log("ERR ::: AuthResolver : getuserinfo");
                    deferred.resolve(error);
                });
                return deferred.promise;
            }
        },
    }
});

app.factory('PaymentFactory', function ($q, $http, $timeout, $rootScope, $state, SERVER_CONFIG, APP_CONFIG, PAYMENT_CONFIG, JSHelper) {

    var payment = {};

    payment.variables = {
        config: "",

        hasSavedCards: false,
        savedCards: false,

        cardToDelete: {
            id: 0
        },
        cardToUseForPayment: {
            id: 0,
            csc: ''
        }
    }

    /**
    * Get Payment Data in order to populate the credit cards swiper
    *
    * @returns {Object} PaymentData
    **/
    payment.GetPaymentData = function () {

        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: SERVER_CONFIG.baseUrl + PAYMENT_CONFIG.link_paymentData
        }).then(function (res) {
            payment.variables.hasSavedCards = res.data.hasCards;
            payment.variables.savedCards = res.data.cards;

            if (res.data.hasCards) {
                payment.SetCurrentCard(res.data.cards[0].id);
            }

            deferred.resolve(res.data);
        }, function (error) {
            console.log("ERR ::: PaymentFactory : GetPaymentData");
            deferred.reject(error.data);
        });
        return deferred.promise;
    }

    /**
    * Get Checkout Configuration to send for the gateway when processing the payment
    *
    * @returns {Object} CheckoutData
    **/
    payment.GetCheckoutConfiguration = function (passedModel) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + PAYMENT_CONFIG.link_paymentConfig,
            data: passedModel
        }).then(function (res) {
            payment.variables.config = res.data;
            deferred.resolve(res.data);
            console.log(res);
        }, function (error) {
            console.log("ERR ::: PaymentFactory : GetCheckoutConfiguration");
            deferred.reject(error.data);
        });
        return deferred.promise;
    }

    /**
    * Set Current Credit Card to use for payment, this method is called when the swiper is initialized, setting it to the firstslide, 
    * as well as onSlideChangeEnd setting it to the current active slide
    *
    * @param {string} passedId Id of the current Active Slide of the Credit Cards Swiper
    **/
    payment.SetCurrentCard = function (passedId) {
        payment.variables.cardToUseForPayment.id = passedId
    }

    /**
    * Set Cr3edit To Delete. This method is called when the user click on the bin and choses both yes or no ( adjust accordingly)
    *
    * @param {string} passedId Id of the current Active Slide of the Credit Cards Swiper
    **/
    payment.SetCardToDelete = function (passedId) {
        payment.variables.cardToDelete.id = passedId
    }

    /**
    * Pass an id to delete the chosen credit card. This method only notify the user that he is about to delete a card. 
    * It is followed by the actual deletion.
    *
    * @param {string} passedId Id of the chosen credit card
    **/
    payment.DeleteCC = function (passedId) {
        payment.variables.cardToDelete.id = passedId;
        if (navigator) {
            navigator.notification.confirm(
                'Are you sure you would like to delete this credit card?', // message
                payment.DeleteCCConfirm,            // callback to invoke with index of button pressed
                'Delete Credit Card',           // title
                ['Delete', 'Cancel']     // buttonLabels
            );
        }
    }

    /**
    * Confirmation method to delete the credit card.
    *
    * @param {string} buttonIndex Chosen button from the navigator notification
    **/
    payment.DeleteCCConfirm = function (buttonIndex) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + PAYMENT_CONFIG.link_deleteSavedCard,
            data: {
                id: payment.variables.cardToDelete.id
            }
        }).then(function (res) {
            deferred.resolve(res.data);
        }, function (error) {
            console.log("ERR ::: PaymentFactory : DeleteCCConfirm");
            deferred.reject(error.data);
        });
        return deferred.promise;
    }

    /**
    * Pay with currently set credit ard in the paymenet variables    
    **/
    payment.PayWithOldCC = function (passedModel) {

        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: SERVER_CONFIG.baseUrl + PAYMENT_CONFIG.link_payWithSavedCard,
            data: passedModel,
        }).then(function (res) {
            deferred.resolve(res.data);
        }, function (error) {
            console.log("ERR ::: PaymentFactory : PayWithOldCC");
            deferred.reject(error.data);
        });
        return deferred.promise;

    }

    /**
    * Only call function once you have checked that the chekout configuration is not undefined 
    * Open Payment Gateway using the plugin OverApp Browser and pass the checkout parameters. 
    * Once method is called 
    * Once load stop and the response is successfull modify accordinlgy the success part of the call.
    *
    * @param {string} successStateRedirect Receipt url once new card is successfull
    * @param {number} passedHeaderHeight Reserved Space from top
    * @param {number} passedFooterHeight Reserved Space from bottom
    **/
    payment.UseNewCreditCard = function (successStateRedirect, passedHeaderHeight, passedFooterHeight) {
        console.log(payment.variables.config);
        if (device) {
            $timeout(function () {
                var isiOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";
                var isIpad = (/ipad/i.test(navigator.userAgent.toLowerCase()));

                var headerHeight = passedHeaderHeight || 0;
                var footerHeight = passedFooterHeight || 0;

                var originx = 0,
                    originy = headerHeight, // Header height: 38px
                    width = window.innerWidth;
                var height = window.innerHeight - (headerHeight + footerHeight);// Header height: 38px & Footer height :  53px

                if (isiOS) {
                    originy += 20;
                }
                // console.log(originx, originy, width, height);

                var centerx = (width / 2) - 25,
                    centery = (height / 2) - 25;
                // console.log(centerx, centery, width, height);

                try {
                    
                    browserI = new OverAppBrowser(SERVER_CONFIG.baseUrl + PAYMENT_CONFIG.link_paymentPage, originx, originy, width, height, true);

                    var firstLoad = true;

                    browserI.addEventListener('loadstop', function () {
                        browserI.insertCSS(
                            {
                                code: 'body.validateable .container.pay .inline-middle.merchantName>h3{display:none}body.validateable .container.pay .btn.btn-success{background-color:#000;border-color:#000;color:newCC-btn-c}body.validateable .container.pay .btn.btn-success[data-hppverifybutton]{display:none}body.validateable .container.pay .btn.cancelButton{border-color:#B5B5B5;color:#B5B5B5}'
                            }
                        );
                        if (firstLoad == true) {
                            firstLoad = false;
                            browserI.executeScript(
                                {
                                    code: "document.getElementById('paymentScript').setAttribute('data-complete','" + payment.variables.config.redirectUrl.replace(/'/g, "") + "');InitPayment('" + JSON.stringify(payment.variables.config.checkoutConfiguration) + "');Checkout.showPaymentPage();"
                                }
                            );
                        }
                    });

                    browserI.addEventListener('loadstop', function () {
                        browserI.executeScript({
                            code: '(typeof iobmessage === \'undefined\'?null:iobmessage)'
                        }, function (value) {
                            if (value[0] != null) {
                                browserI.close();
                                browserI = undefined;
                                var resp = value[0] + "";
                                if (resp.indexOf("200~") == 0) {
                                    //success
                                    $rootScope.FetchUserInfos();
                                    $state.go(successStateRedirect, { "id": resp.replace('200~', '') });
                                } else if (resp.indexOf("499~") == 0) {
                                    //Your transaction has been cancelled 
                                } else {
                                    browserI.close();
                                    browserI = undefined;
                                    //failure
                                }
                            }
                        });
                    });

                    browserI.addEventListener('exit', function () {
                        $('#loaderDivForced').removeClass('show');
                        $("form#requestCreditCardForm").find(".form-actions").removeClass("loading");
                        JSHelper.ClosePanel('#new-creditcard');
                    });
                } catch (err) {

                }

            }, 300);
        }
    }

    return payment;
});

app.factory('httpInterceptor', function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }

            return $q.reject(response);
        }
    };
})