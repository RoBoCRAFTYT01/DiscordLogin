$(document).ready(function () {
    if ($(window).scrollTop() >= 5) {
        $(".navbar").css("background-image", "linear-gradient(to top, #5922bf 100%, #5922bf 100%)");
    } else {
        $(".navbar").css("background-image", "");
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 5) {
            $(".navbar").css("background-image", "linear-gradient(to top, #5922bf 100%, #5922bf 100%)");
        } else {
            $(".navbar").css("background-image", "");
        }
    });
    $("svg circle").attr("fill", "#000000");
});