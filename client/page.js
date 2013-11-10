/**
 * @fileoverview Display visitor pages and such
 */

Template.visitorPage.rendered = function() {
    var visitor_id = Cookie.get(AppCookie.visitor_id);
    var page_id = Session.get('page_id');
    Meteor.call('visitor.update', visitor_id, page_id, function(err, visitor_id) {
        if (Cookie.get(AppCookie.visitor_id)) {
            console.log('welcome back, visitor ' + visitor_id);
        } else {
            Cookie.set(AppCookie.visitor_id, visitor_id);
            console.log('hello, new visitor ' + visitor_id);
        }
    });
}
