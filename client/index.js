
// Globally available
Handlebars.registerHelper("isLoggedIn", function() {
    return !!Meteor.userId();
});
var DateFormats = {
    short: "HH:mm:ss",
    long: "dddd DD/MM/YYYY HH:mm"
};
Handlebars.registerHelper("formatDate", function(timestamp, format) {
    if (moment) {
        var f = DateFormats[format];
        return moment(timestamp).format(f);
    } else {
        return timestamp;
    }
});

Template.urlList.cached_urls = function () {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls;
};

function Test(e) {}


//Template.previewhead.preview = function() {
//    var cachedUrls = CachedUrls.find({}).fetch();
//    return cachedUrls[0];
//};

Template.preview.webpage = function() {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls[0];
};
var highlighted = null;
Template.preview.events({
    'mouseenter': function(e) {
        var target = $(e.target);
        if (highlighted) {
            highlighted.removeClass('highlight');
        }
        highlighted = target;
        highlighted.addClass('highlight');
    },
    'mouseleave': function(e) {

    }
});

Meteor.startup(function () {
    // code to run on client load (not necessarily dom ready)

    Deps.autorun(function () {
        if (Meteor.userId()) {
            Meteor.subscribe('cached_urls', Meteor.userId());
            Meteor.subscribe('chat_rooms');

            if (Session.get('chat_room_id')) {
                Meteor.subscribe('chat_messages', Session.get('chat_room_id'));
            }
        }
    });
});

$(document).ready(function() {
    $('.nav a').each(function(i, el){
        el.click(function(){
            $(this).addClass('active');
        });
    });
});

// to set a callback to run before any routing function. Useful to reset session variables.
Meteor.Router.beforeRouting = function() {
    $('.nav a').each(function(i, el){
        $(el).removeClass('active');
    });
};



Meteor.Router.add({
    '/': 'landingPage',
    '/learn': 'learnPage',
    '/dash': function() {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        return 'dashboardPage';
    },
    '/chat': function() {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        return 'chatList';
    },
    '/chat/:chat_room_id': function(chat_room_id) {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        Session.set('chat_room_id', chat_room_id);
        return 'chatPage';
    },
    '*': 'not_found'
});
