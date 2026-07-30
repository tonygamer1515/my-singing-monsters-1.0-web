jQuery.fn.center = function(parent) {
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }
    this.css({
        "position": "absolute",
        "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
        "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
    });
return this;
}


var lastElement = null;
var currentElement = null;

$(document).ready( function() {
    $("#email_login").center();
    $("#email_registration").center();
    $("#main").center();
    showMain();
});

function showMain() {
    $("#email_login").hide();
    $("#email_registration").hide();
    $("#main").center();
    $("#main").show();
}

function showEmailLogin() {
    $("#main").hide();
    $("#email_registration").hide();
    $("#email_login").center();
    $("#email_login").show();
  
}

function showEmailRegistration() {
    $("#main").hide();
    $("#email_login").hide();
    $("#email_registration").show();
    $("#email_registration").center();
}
