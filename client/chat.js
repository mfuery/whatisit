/**
 * @fileoverview
 */

Template.chatList.chatRooms = function() {
    var chatRooms = ChatRooms.find({}).fetch();
    return chatRooms;
}

Template.chatList.events({
    'submit #chat-room-form': function(e) {
        var name = $('#chat-room-input').val().trim();
        Meteor.call('saveChatRoom', name, Session.get('page_id'), function(error, _id){
            Session.set('chat_room_id', _id);
            Meteor.Router.to('/chat/' + _id);
        });
        $('#chat-room-input').focus();
        $('#chat-history').scrollTop(99999999);
        return false;
    }
});

Template.chatPage.created = function() {
    $('#chat-room-input').focus();
}


////////////////////////////////////////////

Template.chatPage.events({
    'submit #chat-msg-form': function(e) {
        var msg = $('#chat-msg-input').val().trim();
        Meteor.call('saveChatMessage', Session.get('chat_room_id'), msg, Session.get('page_id'), function(error, _id){
        });
        $('#chat-msg-input').val('');
        return false;
    }
});

Template.chatPage.created = function() {
    $('#chat-msg-input').focus();
}

Template.chatPage.chatMessages = function() {
    var chatMessages = ChatMessages.find({
        chat_room_id: Session.get('chat_room_id')
    }).fetch();
    return chatMessages;
}
