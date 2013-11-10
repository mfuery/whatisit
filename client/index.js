

Template.page.isUserLoggedIn = function() {
    console.log(!!Meteor.userId())
    return !!Meteor.userId();
}


Template.urlList.cached_urls = function () {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls;
};

function Test(e) {}

Template.downloadUrl.events({
    'submit #fetch-url-form' : function (e) {
        var url = $('#url-input').val().trim();
        //$(evt.target).val('');
        console.log(e);
        Meteor.call('downloadUrl', url, Meteor.userId());
        return false;
    },
});

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
    
    Meteor.subscribe('cached_urls', Meteor.userId());
});

$(document).ready(function() {

});

Meteor.Router.add({
    '/': 'landingPage',
    '/learn': 'learnPage',
    '/dash': function() {
        return Meteor.userId() ? 'dashboardPage' : 'landingPage';
    },
    '*': 'not_found'
});
