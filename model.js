////////// Shared code (client and server) //////////

// Collections
/*
 { user_id: 123, url, content, name }
 */
CachedUrls = new Meteor.Collection('cached_urls');

/* These are the revisions
 { user_id, cached_url_id, content, timestamp }
 */
Pages = new Meteor.Collection('pages');

/*
 { user_id, user_email, chat_room_id, message, timestamp }
 */
ChatMessages = new Meteor.Collection('chat_messages');

/*
 { user_id, page_id, name }
 */
ChatRooms = new Meteor.Collection('chat_rooms');

if (Meteor.isServer) {
    Meteor.publish('cached_urls', function(user_id) {
        var where = {};
        if (user_id) {
            where.user_id = user_id;
        }
        return CachedUrls.find(where, {sort:{timestamp:-1}});
    });

    Meteor.publish('chat_messages', function(chat_room_id) {
        var where = {};
        if (chat_room_id) {
            where.chat_room_id = chat_room_id;
        }
        return ChatMessages.find(where);
    });

    Meteor.publish('chat_rooms', function(user_id, page_id) {
        var where = {};
        if (user_id) {
            where.user_id = user_id;
        }
        if (page_id) {
            where.page_id = page_id;
        }
        return ChatRooms.find(where, {sort:{timestamp:-1}});
    });
}
