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

$("#newsLetterForm").validate({
    ignore: "",
    errorClass: "form-error-label",
    errorElement: 'label',
    errorPlacement: function (error, element) {
        error.insertAfter(element);
    },
    highlight: function (element, errorClass, validClass) {
        $(element).parents(".form__controls").addClass(errorClass).removeClass(validClass);
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).parents(".form__controls").removeClass(errorClass).addClass(validClass);
    },
    rules: {
        firstName: "required",
        lastName: "required",
        email: {
            email: true,
            required: true
        },
        countryId: "required"
    },
    messages: {

    },
    submitHandler: function (form, event) {
        event.preventDefault();
        $(form).parents('.form-container').addClass('loading');
        $.ajax({

            url: $('#baseurl').val() + "Data/JoinNewsletter",
            type: "post",
            data: $(form).serialize(),
            dataType: "json",
            success: function (response) {
                $(form).parents('.form-container').removeClass('loading');
                $(form)[0].reset();
                if (response.status == 200) {
                    $(form).parents('.form-container').addClass('success');
                }
                else {
                    $(form).parents('.form-container').addClass('error');
                    setTimeout(function () {
                        $(form).parents('.form-container').removeClass('error');
                    }, 2500);
                }
            }
        });

    }
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