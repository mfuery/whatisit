
Template.dashboardPage.events({
    'submit #fetch-url-form' : function (e) {
        var url = $('#url-input').val().trim();
        //$(evt.target).val('');
        Meteor.call('downloadUrl', url, Meteor.userId());
        return false;
    }
});
