////////// Shared code (client and server) //////////

// Collections
/*
 { user_id: 123, url, content, name }
 */
PageEdits = new Meteor.Collection('page_edits');

/* These are the revisions
 { user_id, group_id, content, timestamp }
 */
Pages = new Meteor.Collection('pages');

/*
 { user_id, user_email, chat_room_id, message, timestamp }
 */
ChatMessages = new Meteor.Collection('chat_messages');

/*
 { user_id, group_id, page_id, name }
 */
ChatRooms = new Meteor.Collection('chat_rooms');

/*
{ user_id, group_id, page_id, type }
*/
Content = new Meteor.Collection('content');

/*
 {group_id, type, timestamp, data:{}}
 same collection, different 'type' and accompanying metadata object
 sort by marketing_score

 Marketing Blog Post performance
 Product eCommerce page w/ stats: visits, conversion rate, time viewed
 A/B Test score
 Campaign Goals and status
 Negative Review alert
 New “advocate” - indication of virality, brand improving

 */
Notifications = new Meteor.Collection('notifications');
NotificationType = {
    BLOG: 0,
    PRODUCT_PAGE: 1,
    AB_TEST: 2,
    CAMPAIGN: 3,
    NEGATIVE_REVIEW: 4,
    NEW_ADVOCATE: 5
}

/*
 {  }
 */
Visitors = new Meteor.Collection('visitors');


User = {
    get: function() {
        return Meteor.user();
    },
    getId: function() {
        return Meteor.userId();
    },
    getGroupId: function() {
        var user = User.get();
        var id = null;
        if (user) {
            id = user.profile.group_id;
        }
        return id;
    }
};


if (Meteor.isServer) {
    Meteor.publish('pages', function(group_id, user_id) {
        var where = {};
        if (group_id) {
            where.group_id = group_id;
        }
        if (user_id) {
            where.user_id = user_id;
        }
        return Pages.find(where, {sort:{timestamp:-1}});
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
