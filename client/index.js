

Template.page.isUserLoggedIn = function() {
    console.log(!!Meteor.userId())
    return !!Meteor.userId();
}


Template.urlList.cached_urls = function () {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls;
};

Template.downloadUrl.events({
    'submit #fetch-url-form' : function (e) {
        var url = $('#url-input').val().trim();
        //$(evt.target).val('');
        Meteor.call('downloadUrl', url, Meteor.userId());
        return false;
    }
});

Template.previewhead.preview = function() {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls[0];
};

Template.previewbody.preview = function() {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls[0];
};

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
