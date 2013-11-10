/**
 * @fileoverview Display visitor pages and such
 */

Template.pageList.pagesList = function() {
    var pages = Pages.find({}, {
        fields: {
            _id: 1,
            user_id: 1,
            name: 1,
            url: 1,
            timestamp: 1
        }
    }).fetch();
    return pages;
}

Template.visitorPageList.pagesList = function() {
    return Template.pageList.pagesList();
}
