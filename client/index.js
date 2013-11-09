

Template.urlList.cached_urls = function () {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls;
};

Template.basic.events({
    'click button' : function () {
        // todo
    },
    'keyup .input-area input': function (evt) {
        if(evt.which === 13) {
            var url = $(evt.target).val().trim();
            //$(evt.target).val('');
            Meteor.call('downloadUrl', url, Meteor.userId(), function(err, result) {
                console.log(arguments);
            });
        }
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
