function onDeviceReady() {
    var isiOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";

    if(isiOS){
        $("html").addClass("isIOS");
    }
    //navigator.splashscreen.hide();  

    setTimeout(function(){
        angular.bootstrap($("html"),["appDeck"]);
        if(window.cordova){
            setTimeout(function () {                
                // $(".splash-bg").fadeOut();
            }, 4000);
        }   
    },0);

    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByHexString("#000000");
    if (isiOS) {
        window.plugins.webviewcolor.change("#000000");
    }

    setTimeout(function () {
        initPushNotification();
    }, 5000);

    document.addEventListener("offline", onOffline, false);
 
    function onOffline() {
        $('#noInternet').addClass('open');
    }

    document.addEventListener("online", onOnline, false);
 
    function onOnline() {
        $('#noInternet').removeClass('open');
    }

}

var pushServerBaseUrl = "http://push.koeinbeta.com/Service.asmx";

var applicationId = 14;

var state = "active"
var firstOpen = true;
var deviceToken = null;

var initPushNotification = function () {

    // window.FirebasePlugin.grantPermission();

    // var isiOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";
    // document.addEventListener("pause", onPause, false);

    // window.FirebasePlugin.getToken(function (token) {
    //     AddDeviceToOurDatabase(token);
    // }, function (error) {
    // });
    // window.FirebasePlugin.onTokenRefresh(function (token) {
    //     AddDeviceToOurDatabase(token);
    // }, function (error) {
    // });

    // window.FirebasePlugin.onNotificationOpen(function (data) {
    //     var message = data.notification == undefined ? data.body : data.notification.body;
    //     var pushUrl = data.url;
    //     var buttonLabel = data.key3;
    //     var type = data.key4;
    //     var goToLocation = "#!/";
    //     goToLocation += (pushUrl == undefined ? "" : pushUrl);
    //     var buttons = [buttonLabel == undefined ? 'view' : buttonLabel, 'ok'];
    //     if (goToLocation == "#!/") {
    //         buttons = ["ok"];
    //     }
    //     if (type == 'account-approved') {
    //         buttons = [buttonLabel];
    //     }
    //     navigator.notification.confirm(
    //         message,
    //         function (button) {
    //             if (goToLocation != "#!/" && button == '1') {
    //                 window.location.href = goToLocation;
    //             }
    //         },
    //         data.title,
    //         buttons
    //     );

    //     if (type == 'refill') {
    //         var elem = $('html').eq(0);
    //         var mainController = angular.element(elem).scope();
    //         mainController.FetchUserInfos();
    //     }

    // }, function (error) {
    //     console.log("error");
    //     console.log(error);
    // });


    // setTimeout(function () { var firstOpen = false; }, 1000);
    // document.addEventListener("resume", onResume, false);
}
var AddDeviceToOurDatabase = function (token, email) {
     if (window.cordova) {
        cordova.getAppVersion(function (version) {
            appVersion = version;
            deviceToken = token == undefined ? deviceToken : token;
            $.ajax({
                url: pushServerBaseUrl + "/AddNewUserDevice",
                type: 'Post',
                data: {
                    applicationId: applicationId,
                    groupIds: null,
                    token: deviceToken,
                    email: (email == undefined ? null : email),
                    name: (device.name == undefined ? "" : device.name),
                    language: "en",
                    model: (device.model == undefined ? "" : device.model),
                    cordovaVersion: (device.cordova == undefined ? "" : device.cordova),
                    platform: (device.platform == undefined ? "" : device.platform),
                    uuid: (device.uuid == undefined ? "" : device.uuid),
                    version: (device.version == undefined ? "" : device.version),
                    appVersion: appVersion
                },
                success: function (data) {
                    if (data.status == "success") {
                    } else {
                    }
                }
            });
        });
    }
}
var onPause = function () {
    state = "inactive"
    firstOpen = false;
}
var onResume = function () {
    var isiOS = device.platform == "IOS" || device.platform == "ios" || device.platform == "iOS";
    if (isiOS) {
        setTimeout(function () { state = "active"; }, 1000);
    } else {
        state = "active";
    }

    var appElement = document.querySelector('ng-view');
    var appScope = angular.element(appElement).scope();

    if (appElement != undefined && appScope != undefined) {
        if (appScope.controller == "myaccount") {
            appScope.GetData();
        }
    }
}