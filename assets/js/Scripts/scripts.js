function ChangeCategory(isCountry, isReport) {
    var baseurl = $('#baseurl').val();
    var category = $('#categoryFilter').val();
    var country = $('#countryFilter').val() + "";

    if (!isReport) {
        if (isCountry) {
            window.location.href = baseurl + ("Category/بلدان/" + (country != "" ? (country + "/") : "الجميع/") + category);
        }
        else {
            if (category != "") {
                window.location.href = baseurl + ("Category/" + category);
            }
        }
    }
    else {
        if (category != "") {
            window.location.href = baseurl + ("Category/ملفات-و-تحقيق/" + category);
        }
    }

}
function ChangeSubcategory(isCountry, isReport) {

    var baseurl = $('#baseurl').val();
    var category = $('#categoryFilter').val()+"";
    var subcategory = $('#subcategoryFilter').val()+"";
    var country = $('#countryFilter').val()+"";

    if (!isReport) {
        if (isCountry) {
            window.location.href = baseurl + ("Category/بلدان/" + (country != "" && country != "undefined" ? (country + "/") : "الجميع/") + category + "/" + subcategory);
        }
        else {
            window.location.href = baseurl + ("Category/" + category + "/" + (subcategory != "" && subcategory != "undefined" ? (subcategory + "/") : "/الجميع") + country);
        }
    }
    else {
        window.location.href = baseurl + ("Category/ملفات-و-تحقيق/" + category + "/" + (subcategory != "" && subcategory != "undefined" ? (subcategory + "/") : "/الجميع") + country);
    }

}
function ChangeCountry(isCountry, isReport) {

    var baseurl = $('#baseurl').val();
    var category = $('#categoryFilter').val()+"";
    var subcategory = $('#subcategoryFilter').val()+"";
    var country = $('#countryFilter').val();

    if (!isReport) {
        if (isCountry) {
            if (country != "") {
                window.location.href = baseurl + ("Category/بلدان/" + (country != "" ? country + "/" : "الجميع/") + (category != "" && category != "undefined" ? (category + "/") : "") + subcategory);
            }
            else {
                window.location.href = baseurl + ("Category/بلدان/" + (country != "" ? country + "/" : "الجميع/") + (category != "" && category != "undefined" ? (category + "/") : "") + subcategory);
            }
        }
        else {
            window.location.href = baseurl + ("Category/" + category + "/" + (subcategory != "" && subcategory != "undefined" ? (subcategory + "/") : "الجميع/") + country);
        }
    }
    else {
        window.location.href = baseurl + ("Category/ملفات-و-تحقيق/" + (category != "" ? (category + "/") : "الجميع/") + (subcategory != "" && subcategory != "undefined" ? (subcategory + "/") : "الجميع/") + country);
    }
}

function LoadMoreArticles(e, page){
    //e.preventDefault();
    $(e).remove();
    var isCountry = $('#isCountry').val();
    $.ajax({
        url: $('#baseurl').val() + (isCountry == "true" ? "Category/CountryIndex" : "Category"),
        data: $('#HiddenParams').serialize()+"&page="+page,
        dataType: "html",
        success: function (response) {
            $(response).appendTo(".holder-single-article");
            //$('#page').val(parseInt($('#page').val()) + 1);
        }
    });
}

function LoadMoreReports(e, page) {
    //e.preventDefault();
    $(e).remove();
    $.ajax({
        url: $('#baseurl').val() + "Category/ReportIndex",
        data: $('#HiddenParams').serialize() + "&page=" + page,
        dataType: "html",
        success: function (response) {
            $(response).appendTo(".section-list-article");
            //$('#page').val(parseInt($('#page').val()) + 1);
        }
    });
}

function LoadMoreReportArticles(e, page) {
    $(e).remove();
    $.ajax({
        url: $('#baseurl').val() + "Report/",
        data: $('#HiddenParams').serialize() + "&page=" + page,
        dataType: "html",
        success: function (response) {
            $(response).appendTo(".featured-articles-list");
            //$('#page').val(parseInt($('#page').val()) + 1);
        }
    });
}


$(document).on('click', '.btn-search-more', function (e) {
    e.preventDefault();
    $(this).remove();
    $.ajax({
        url: $('#baseurl').val() + "Search?term=" + $('#search-term').val(),
        data: { page: $('#page').val(), isPartial: true },
        dataType: "html",
        success: function (response) {
            $(response).appendTo(".holder-single-article");
            $('#page').val(parseInt($('#page').val()) + 1);
        }
    });
});


function LoadSocialMedia() {

    //$.getScript('https://s7.addthis.com/js/152/addthis_widget.js');
}

$('.back-to-listing .btn-close').on('click', function () {
    if (jQBrowser.name == "safari") {
        history.go(-1); return false;
    }
    history.back();
});