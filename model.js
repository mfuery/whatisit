////////// Shared code (client and server) //////////

// Collections
CachedUrls = new Meteor.Collection('cached_urls');
/*
 { user_id: 123 }
 */
Pages = new Meteor.Collection('pages');
/*
{ user_id, cached_url_id, content, timestamp }
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
