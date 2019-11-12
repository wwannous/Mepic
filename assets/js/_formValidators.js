/**
 * Jquery Custom Validators includes:
 *  > isWeekend
 *      [Notifies the user if chosen date falls a saturday/sunday]
 *  > landlinephone
 *      [Validates the phone number entered as a lebanese landline (https://en.wikipedia.org/wiki/Telephone_numbers_in_Lebanon) ]
 *  > mobilephone
 *      [Validates the phone number entered as a lebanese mobile (https://en.wikipedia.org/wiki/Telephone_numbers_in_Lebanon) ]
 *  > isemail
 *      [email entered should be of the format xxx@xxx.xxx]
 */

$.validator.addMethod("isWeekend", function (value, element) {
    var myDate = new Date(value);
    if (myDate.getDay() == 6 || myDate.getDay() == 0) return false; else return true;
}, ("invalid date"));
// }, ("Date should be a working day"));

$.validator.addMethod("landlinephone", function (value, element) {
    if (value.indexOf("0") == 0) {
        value = value.substr(1);
    }
    var filter = /^[1456789]([0-9]{6})$/;
    if (value == '' || filter.test(value)) return true; else return false;
}, "invalid phone");

$.validator.addMethod("mobilephone", function (value, element) {

    var filter_zero_three = /^3([0-9]{6})$/,
        filter_seven_zero = /^70([0-9]{6})$/,
        filter_seven_one = /^71([0-9]{6})$/,
        filter_seven_six = /^76([0-9]{6})$/,
        filter_seven_eight = /^78[89]([0-9]{5})$/,
        filter_seven_nine = /^79[123]([0-9]{5})$/,
        filter_eight_one = /^81[2367]([0-9]{5})$/;

    if (value.indexOf("0") == 0) {
        value = value.substr(1);
    }

    if (value == '' ||
        filter_zero_three.test(value) ||
        filter_seven_zero.test(value) ||
        filter_seven_one.test(value) ||
        filter_seven_six.test(value) ||
        filter_seven_eight.test(value) ||
        filter_seven_nine.test(value) ||
        filter_eight_one.test(value)) {
        return true
    }
    else {
        return false
    }
}, "invalid phone");

$.validator.addMethod("isemail", function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}, "invalid email");

