app.constant('SERVER_CONFIG', {

    //#region Local
    // baseUrl: 'https://api.mobi.net.lb/',
    //#endregion

    //#region Shift2
    //  baseUrl: 'https://api.mobi.net.lb/',
    //#endregion

    //#region Online
    //baseUrl: 'https://localhost:44365/',

    baseUrl: 'http://localhost:15988/',
    resizeUrl: 'http://api.awalan.com/Images/'
    //baseUrl: 'https://leroyalapi.koeinbeta.com/',
    //baseUrl: 'https://shift2s.koein.com/leroyalapi/',
    //baseUrl: 'https://localhost:44365/',
    //#endregion
    //image_host: 'https://appapi.leroyal.com/content/uploads/',
});

app.constant('ARTICLE_CATEGORY_IDS', {
    simple_listing: 1,
    three_col_identical: 2,
    three_col_anwan: 3,
    masonry_blocks: 4,
    masonry_videos: 5,
    four_col_horizontal: 6,
    three_col_aksar: 7
});

app.constant('SESSION_CONFIG', {
    headers_user_origin: 'leroyal',
});

app.constant('APP_STATES', {
    reset_password_success: 'app.resetpasssuccess',
});

app.constant('APP_CONFIG',{
    payment_enabled_savedCards : false,
    gps_enabled_checkpermissions : true
})

app.constant('Basket_EVENTS', {
    itemAdded: 'item-added-to-basket',
    fetchItem: 'fetch-item',
    removeItemBasket: 'remove-item-from-basket',
    removeItemBasketConfirmed: 'remove-item-from-basket-confirmed',
    currencyChanged: 'currency-changed',
    mailGiftWrapped : 'mail-gift-wrapped',
    addressGiftWrapped : 'address-gift-wrapped',
    removeGiftBasket : 'remove-gift-basket',
    addressRemoved : 'address-removed'
  });

  app.constant('PAYMENT_CONFIG',{
    link_paymentData : 'api/RefillTransactionRequests/GetCreditCardData',
    link_paymentConfig : 'api/MyCart/Ecommerce',
    link_paymentPage : 'Receipt/ReturnPaymentPage',
    link_deleteSavedCard : 'api/Resellers/DeleteCard',
    link_payWithSavedCard : 'api/RefillTransactionRequests/PayWithSavedCard'
})

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
  });

app.constant('MAP_DEFAULT_LOCATION', {
    lattitude: 33.8938,
    longitude: 35.5018,
    zoom: 16
});

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    fbLoginSuccess: 'fb-auth-login-succes',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    serverError: 'server-error',
    ressourceNotFound: 'ressurce-notFound',
    networkErrorPosting: 'network-connection-post-failed',
    networkErrorGetting: 'network-connection-get-failed'
});

app.constant('AUTH_EVENTS_USER_FRIENDLY', {
    loginFailed: 'Invalid Credentials' 
  });
  