$(function ($) {
    $(document).ajaxSend(function () {
        fadeInSpinnrer
    });
    $(document).ajaxComplete(function () {
        fadeOutSpinner();
    });
    $(document).ajaxError(function () {
        fadeOutSpinner();
    });
});

function fadeInSpinnrer() {
    $("#overlay").fadeIn(300);
}

function fadeOutSpinner() {
    setTimeout(function () {
        $("#overlay").fadeOut(300);
    }, 500);
}