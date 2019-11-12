app.service('myServices', function () {
    this.ConvertObjectToQueryString = function (inputObject, includingEmty) {
        var str = '';
        for (var key in inputObject) {
            if (key.indexOf('exc_') == -1) {
                if (!inputObject.hasOwnProperty(key) || typeof inputObject[key] === 'function') {
                    continue;
                }
                if (typeof inputObject[key] === 'object') { // an object and an array are objects
                    str += (str == '' ? '' : '&') + key + '=' + encodeURIComponent(inputObject[key].join());
                } else {
                    str += (str == '' ? '' : '&') + key + '=' + encodeURIComponent(inputObject[key]);
                }
            }
        }
        if (includingEmty == undefined || includingEmty == false) {
            str = str.replace(/(&?\w+=((?=$)|(?=&)))/g, '');
        }
        if (str.indexOf("&") == 0) {
            str = str.substring(1, str.length);
        }
        return str;
    }

    this.ConvertObjectToKendoFilterQueryString = function (inputObject) {
        var str = '';
        for (var key in inputObject) {
            if (!inputObject.hasOwnProperty(key) || typeof inputObject[key] === 'function') {
                continue;
            }
            if (typeof inputObject[key] === 'object') { // an object and an array are objects
                str += (str == '' ? '' : '~and~') + key + '~' + encodeURIComponent(inputObject[key].join());
            } else if (inputObject[key] != '') {
                str += (str == '' ? '' : '~and~') + key + '~' + encodeURIComponent(inputObject[key]);
            }
        }
        str = str.replace(/(&?\w+=((?=$)|(?=&)))/g, '');
        if (str.indexOf("~and~") == 0) {
            str = str.substring(1, str.length);
        }
        return str;
    }

    this.parseFilterString = function (filterString) {

        filterString = filterString == undefined ? "" : filterString;
        filterString = decodeURIComponent(filterString);
        // Remove all of the ' characters from the string.
        filterString = filterString.replace(/[']/g, '');
        // Split the string into an array of strings, using the ~ as a delimiter.
        var ss = filterString.split("~"); // ss stands for "split string". I'm clever.
        var F = []; // Used to store all of the parsed filters.
        var fIndex = -1; // Used to track filter index.
        var cIndex = 0; // Used to track filter index within a composite filter object.
        var isComposite = false; // Used to indicate if a composite filter is currently being parsed.
        for (var i = 0; i < ss.length; i++) {
            if (i % 4 == 0) { // Field.
                if (ss[i].indexOf('(') > -1) { // If we're starting a composite object, create a composite object and add it to the parsed filters.
                    F.push({
                        filters: [],
                        logic: ""
                    });
                    fIndex++; // We added an object to the array, so increment the counter.
                    F[fIndex]
                    F[fIndex].filters.push({
                        field: ss[i].replace('(', ''),
                        operator: "",
                        value: ""
                    });
                    cIndex = 0; // We added the first filter to the composite object, so set the counter.
                    isComposite = true;
                } else if (isComposite) { // If we're parsing the second filter in a composite filter object, then add the field to the child filter.
                    F[fIndex].filters.push({
                        field: ss[i],
                        operator: "",
                        value: ""
                    });
                    cIndex++; // We added the second filter to the composite object, so increment the counter.
                } else { // Add the field as normal.
                    F.push({
                        field: ss[i],
                        operator: "",
                        value: ""
                    });
                    fIndex++; // We added an object to the array, so increment the counter.
                }
            }
            if (i % 4 == 1) { // Operator.
                if (isComposite) {
                    F[fIndex].filters[cIndex].operator = ss[i];
                } else {
                    F[fIndex].operator = ss[i];
                }
            }
            if (i % 4 == 2) { // Value.
                if (ss[i].indexOf(')') > -1) {
                    F[fIndex].filters[cIndex].value = ss[i].replace(')', '');
                    isComposite = false;
                } else if (isComposite) {
                    F[fIndex].filters[cIndex].value = ss[i];
                } else {
                    F[fIndex].value = ss[i];
                }
            }
            if (i % 4 == 3) { // Logic.
                if (isComposite) {
                    F[fIndex].logic = ss[i]; // Add the logic to the composite filter object.
                }
                // If the filter is not composite, the logic will always be "and". So, we just don't do anything if that's the case.
            }
        }

        if (F.length > 0 && (F[0].field == undefined || F[0].field == "")) {
            F.splice(0, 1);
        }


        return {
            filters: F,
            logic: "or"
        };
    };


    this.parseSortString = function (sortString) {
        sortString = sortString == undefined ? "" : sortString;
        // Split the string into an array of strings, using the ~ as a delimiter.
        var ss = sortString.split("~"); // ss stands for "split string". I'm clever.
        var S = []; // Array containing sort objects.
        for (var i = 0; i < ss.length; i++) {
            var sort = ss[i].split('-'); // Split sort string into field and direction.
            S.push({
                compare: undefined, // This field exists in the sort objects, but is always undefined (as far as I can tell). I added it anyways, to minimize potential future issues.
                dir: sort[1], // Direction.
                field: sort[0] // Field.
            });
        }
        return S;
    };

    this.parseGroupString = function (groupString, gridObj) {
        groupString = groupString == undefined ? "" : groupString;
        // Split the string into an array of strings, using the ~ as a delimiter.
        var ss = groupString.split("~"); // ss stands for "split string". I'm clever.
        var S = []; // Array containing sort objects.
        for (var i = 0; i < ss.length; i++) {
            var sort = ss[i].split('-'); // Split sort string into field and direction.
            if (sort[0] != "") {
                S.push({
                    dir: sort[1], // Direction.
                    field: sort[0] // Field.
                });
            }
        }

        this.AutoInitGrouping(gridObj, S);
        return S;
    };

    this.AnchorSmoothScroll = function (eID, cheating) {
        var startY = currentYPosition();
        var stopY = elmYPosition(eID) + cheating;
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for (var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            if (elm != null) {
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                }
                return y;
            } else {
                return 0;
            }
        }
    };

    this.AutoInitGrouping = function (gridObj, grouping) {
        if (gridObj != undefined) {
            setTimeout(function () { //wait until thi grid is loaded
                resultsContainer = gridObj.find(".action-wrapper").siblings(".results-wrapper");
                if (grouping.length > 0) {
                    $.each(grouping, function (index, item) {
                        selectedText = gridObj.find(".filter-groupby select option[value='" + item.field + "']").text();
                        $(resultsContainer).append("<div class=\"action-result-wrapper\">" + "<i class=\"zmdi zmdi-close-circle\" onclick=\"resetGrouping(this)\"></i>" + "<div class=\"action-type\">Grouped by: [</div>" + "<div class=\"action-result\">" + selectedText + "</div>" + "<div class=\"action-type\">]</div>" + "</div>")
                    });
                }
            });
        }
    }

});

app.service('Session', function ($rootScope, localStorageService, AUTH_EVENTS) {

    this.create = function (token, userRole) {

        this.access_token = token.access_token;
        this.refresh_token = token.refresh_token;
        this.token_type = token.token_type;
        //this.userId = userId;
        this.userRole = userRole;

        localStorageService.set('token', token);


        //local storage
    };

    this.CreateByKey = function (key, value) {
        this[key] = value
    }

    this.DeleteByKey = function (key) {
        this[key] = null
    }

    this.userInfos = null;

    this.refillWhileBuyingUrl = null;


    this.userPermissions = {};

    this.createMenu = function (menu) {
        this.menu = menu;
    }

    this.destroy = function () {
        this.id = null;
        this.access_token = null;
        this.refresh_token = null;
        this.token_type = null;
        //this.userId = userId;
        this.userRole = null;
        this.userInfos = null;
        //  this.offlineData = null;
        localStorageService.remove('token');
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

        // local storage code
    };

    this.populateData = function (staticData) {
        this.staticData = staticData;
    };

    this.retreiveData = function () {
        return this.staticData;
    };


    this.SetItem = function (key, value) {
        this[key] = value;
    };
    
    this.GetItem = function (key) {
    return this[key];
    };
    
    this.ItemExists = function (key) {
    return this[key] != null;
    };
    
    this.DeleteItem = function (key) {
    this[key] = null;
    };

});

app.service('MapHelper', function ($timeout, NgMap) {

    var self = this;

    var originalLat = 0;
    var originalLng = 0;

    var locationNotId = undefined;
    var locationNotId1 = undefined;
    var locationNotId2 = undefined;

    NgMap.getMap().then(function (gmap) {
        originalLat = gmap.getCenter().lat();
        originalLng = gmap.getCenter().lng();
    });

    this.GetCurrentLocation = function () {
        if (navigator.geolocation) {
            $(".editableMap .notification").removeClass("show");
            $(".editableMap .notificationCtn").hide();
            $timeout.cancel(locationNotId);
            $timeout.cancel(locationNotId1);
            $timeout.cancel(locationNotId2);
            locationNotId = locationNotId1 = locationNotId2 = undefined;

            var GetLoc = function () {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        NgMap.getMap().then(function (gmap) {
                            gmap.setZoom(16);
                            gmap.setCenter({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            });
                        });
                    },
                    function (error) {
                        //in mobile you need to enable your gps
                        var errorMsg = "No permissions to access your location";
                        if (window.cordova) {
                            var isiOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";
                            if (isiOS) {
                                errorMsg = "Please grant permission. Settings -> EasySell -> Location -> While Using the App";
                            } else {
                                errorMsg = "Please grant permission. Settings -> Apps -> EasySell -> Permissions -> Location";
                            }
                        }
                        // $("#AddAddressModalID .error").html(errorMsg);
                        // $(".editableMap .notificationCtn").show();

                        $(".bar-alert .alert-mssg").text(errorMsg);
                        $(".bar-alert").addClass("show-alert");
                        $timeout(function () {
                            $(".bar-alert").removeClass("show-alert");
                            $timeout(function () {
                                $(".bar-alert .alert-mssg").text("");
                            }, 100);
                        }, 5000);

                        // locationNotId = $timeout(function () {
                        //     $(".editableMap .notification").html(errorMsg).addClass("show");
                        // }, 300)
                        // locationNotId1 = $timeout(function () {
                        //     $(".editableMap .notification").removeClass("show");
                        //     locationNotId2 = $timeout(function () {
                        //         $(".editableMap .notificationCtn").hide();
                        //     }, 300)
                        // }, 4000)
                        //ngProgressLite.done();
                        //   $(".editableMap .mylocation-big-map").removeClass("gettingLocation");
                    }, {
                        enableHighAccuracy: true
                    });

            }
            if (window.cordova) {
                //check if location is enabled
                cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
                    if (enabled) {
                        GetLoc();
                    } else {

                        var errorMsg = "Please enable your GPS in order to get your position"

                        $(".bar-alert .alert-mssg").text(errorMsg);
                        $(".bar-alert").addClass("show-alert");
                        $timeout(function () {
                            $(".bar-alert").removeClass("show-alert");
                            $timeout(function () {
                                $(".bar-alert .alert-mssg").text("");
                            }, 100);
                        }, 5000);
                    }

                }, function (error) {

                });
            } else {
                GetLoc();
            }
        }
    }

    this.GoToMarker = function () {
        NgMap.getMap().then(function (gmap) {
            gmap.setCenter({ lat: originalLat, lng: originalLng });
        });
    }

});

/**
 * Caches the data in the local storage and updates the entries if they have changed.
 */
app.service('DataCaching', function ($http, $filter, $q, localStorageService, Session, SERVER_CONFIG) {
    var _self = this;
    this.InitializeDataCaching = function () {
        var lStorage = localStorageService.get('staticData');

        if (!lStorage) {
            localStorageService.set('staticData', staticData);
            lStorage = staticData;
        }
        Session.populateData(lStorage);
    }

    this.updateData = function (updatedSectionArr) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: SERVER_CONFIG.baseUrl + 'api/Settings/GetStaticData'
        }).then(function (res) {
            var currentSession = Session.retreiveData();
            if (moment(res.data.staticDataLastChanged).isAfter(moment(currentSession.staticDataLastChanged))) {
                //if (moment(res.data.staticImageLastChanged).isAfter(moment(currentSession.staticImageLastChanged))) {
                angular.forEach(updatedSectionArr, function (value, key) {
                    angular.forEach(res.data.offlineData[value], function (innerValue, innerKey) {
                        var oldEntry = $filter('filter')(currentSession.offlineData[value], { id: innerValue.id }, false)[0];
                        if (oldEntry != undefined && oldEntry != null && moment(innerValue.imgSrcDateModified).isSameOrBefore(moment(oldEntry.imgSrcDateModified))) {
                            innerValue.imgSrc = oldEntry.imgSrc;
                        }
                    });
                });
                //}
                localStorageService.set('staticData', res.data);
                Session.populateData(res.data);
            }
            deferred.resolve();
        });
        return deferred.promise;
    };
});

app.service('JSHelper', function ($timeout) {

    var $win = $(window);
    var $doc = $(document);

    var currentClass = 'current';
    var openClass = 'is-open';
    var visibleClass = 'is-visible';

    //#region Form Related
    this.FormFieldsValidatePreSubmit = function () {
        setTimeout(function () {
            $("form input, form select, form textearea").focusout(function () {
                $(this).valid();
            })
            $("[data-rule-landlinephone]").keyup(function () {
                $(this).valid();
            })
            $("[data-rule-mobilephone]").keyup(function () {
                $(this).valid();
            })
        }, 0);
    }

    this.AlertForm = function (formElt, message) {
        $(formElt).find(".form__actions").removeClass("loading");
        $(".bar-alert .alert-mssg").text(message);  //res.data.message
        $(".bar-alert").addClass("show-alert");
        // $timeout(function () {
        //     $(".bar-alert").removeClass("show-alert");
        //     $timeout(function () {
        //         $(".bar-alert .alert-mssg").text("");
        //     }, 100);
        // }, errorMessageTimeout);
    }

    this.ResetForm = function () {
        $(".bar-alert").removeClass("show-alert");
        $timeout(function () {
            $(".bar-alert .alert-mssg").text("");
        }, 100);
    }



    //#endregion

    this.ResetAlert = function () {
        $(".bar-alert").removeClass("show-alert");
        $timeout(function () {
            $(".bar-alert .alert-mssg").text("");
        }, 100);
    }

    this.ShowAlert = function (message) {
        $(".bar-alert .alert-mssg").text(message);
        $(".bar-alert").addClass("show-alert");
        $timeout(function () {
            // $(".bar-alert").removeClass("show-alert");
            $timeout(function () {
                // $(".bar-alert .alert-mssg").text("");
                $("#verificationCode").val("");
            }, 100);
        }, errorMessageTimeout);
    }

    this.Init_Panel = function () {
        $('.js-panel-toggle').on('click submit', function (event) {
            event.preventDefault();

            var $toggler = $(this);
            var $panel = $($toggler.data('target'));
            var hash = '';

            if (typeof $panel.data('hash') !== 'undefined') {
                hash = '#' + $panel.data('hash');
            };

            if ($toggler.hasClass('js-panel-close') || $toggler.hasClass('is-' + currentClass)) {
                hash = '';
            };

            history.pushState(null, null, window.location.pathname + hash);

            $win.trigger('popstate');

            $toggler.closest('.' + openClass).removeClass(openClass);
        });

        $win.on('load popstate', function (event) {
            var hash = this.location.hash.slice(1);
            var $element = $('[data-hash="' + hash + '"]');
            var $toggler = $('[data-target="#' + hash + '"]');

            $('.is-' + currentClass).removeClass('is-' + currentClass);
            $('.' + visibleClass).removeClass(visibleClass);

            if ($element.length) {
                $element.addClass(visibleClass);
                $toggler.addClass('is-' + currentClass);
            };
        });
    }

    this.OpenPanel = function (PanelId, event) {
        if (event) {
            event.preventDefault();
        }

        var triggerPanel = $("[data-target='" + PanelId + "']");
        $(triggerPanel).addClass("is-current");

        var modalPanel = $(PanelId);
        $(modalPanel).addClass("is-visible");
        $(modalPanel).find('.js-panel-close').addClass("is-current");
    }

    this.ClosePanel = function (PanelId, event) {
        if (event) {
            event.preventDefault();
        }

        if (browserI != undefined) {
            browserI.close();
            browserI = undefined;
        }
        var triggerPanel = $("[data-target='" + PanelId + "']");
        $(triggerPanel).removeClass("is-current");

        var modalPanel = $(PanelId);
        $(modalPanel).removeClass("is-visible");
        $(modalPanel).find('.js-panel-close').removeClass("is-current");
    }

    this.CloseAllPanels = function () {
        $(".modal-overlay").click()
    }

    this.IsElementInViewport = function (el, topGap, bottomGap, leftGap, rightGap) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        var topLimit = topGap,
            bottomLimit = (window.innerHeight || document.documentElement.clientHeight) - bottomGap,
            leftLimit = leftGap,
            rightLimit = (window.innerWidth || document.documentElement.clientWidth) - leftGap;

        return (
            rect.top >= topLimit &&
            rect.left >= leftLimit &&
            rect.bottom <= bottomLimit && /*or $(window).height() */
            rect.right <= rightLimit/*or $(window).width() */
        );
    }

    this.GoToState = function (toState, stateParams, transitionParams) {
        location.href = toState;
    }

    //#region Specific to Mobi EU
    var $win = $(window);
    var $doc = $(document);

    this.UiSlider = function () {
        $uiSlider = $('.ui-slider');

        $uiSlider.slider({
            value: 3,
            min: 1,
            max: 4,
            step: 1,
            slide: function slide(event, ui) {
                var navPrefix = $(this).data('prefix');
                var currentIdx = ui.value - 1;

                $('.tabs--slider .tabs__nav li').eq(currentIdx).find('a').trigger('click');
            }
        });
    }

    this.CloseMenu = function () {
        $('body').removeClass('nav-shown');
    }
    //#endregion
})

app.service('storageService', function (localStorageService) {

    /**
     * Get Storage Key always from localStorageService
     * @param {String} key
     * @return {Object} Value of requested key
     */
    this.GetStorage = function (key) {
        return localStorageService.get(key);
    };

    /**
     * Remove Storage key from localStorageService if cordova exists and apppreferences.
     * @param {String} key
     */
    this.RemoveStorage = function (key) {
        if (window.cordova) {
            plugins.appPreferences.remove(function () { }, function () { }, key);
        } 
        localStorageService.remove(key);
    };

    /**
     * Set Storage key in localStorageService if cordova exists and apppreferences.
     * @param {String} key
     */
    this.SetStorage = function (key, value) {
        if (window.cordova) {
            plugins.appPreferences.store(function () { }, function () { }, key, value);
        } 
        localStorageService.set(key, value);
    };
});
