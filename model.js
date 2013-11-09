////////// Shared code (client and server) //////////

// Collections
CachedUrls = new Meteor.Collection('cached_urls');
/*
 { user_id: 123 }
 */

if (Meteor.isServer) {
    Meteor.publish('cached_urls', function (user_id) {
        var where = {};
        if (user_id) {
            where.user_id = user_id;
        }
        return CachedUrls.find(where);
    });
}
