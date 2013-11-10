
Template.dashboardPage.events({
    'submit #fetch-url-form' : function (e) {
        var url = $('#url-input').val().trim();
        //$(evt.target).val('');
        Meteor.call('downloadUrl', url, Meteor.userId(), function(error, page_id) {
            Session.set('page_id', page_id);
            Meteor.Router.to('/page/' + page_id);
        });
        return false;
    }
});
