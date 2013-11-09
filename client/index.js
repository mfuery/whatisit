if (Meteor.isClient) {
    Template.hello.greeting = function () {
        return "Welcome to whatisit.";
    };

    Template.hello.events({
        'click input' : function () {
            // template data, if any, is available in 'this'
            if (typeof console !== 'undefined')
                console.log("You pressed the button");
        }
    });
}

Meteor.startup(function () {
    // code to run on client load (not necessarily dom ready)
});

$(document).ready(function() {
});
