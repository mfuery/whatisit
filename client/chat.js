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
            $('#chat-history').scrollTop(99999999);
        });
        $('#chat-msg-input').focus();
        $('#chat-room-input').val('');
        return false;
    },
    'submit #chat-msg-form': function(e) {
        var msg = $('#chat-msg-input').val().trim();
        Meteor.call('saveChatMessage', Session.get('chat_room_id'), msg, Session.get('page_id'), function(error, _id){
            $('#chat-history').scrollTop(99999999);
        });
        $('#chat-msg-input').val('');
        return false;
    }
});

Template.chatList.chatMessages = function() {
    var chatMessages = ChatMessages.find({
        chat_room_id: Session.get('chat_room_id'),
        group_id: User.getGroupId()
    }).fetch();
    return chatMessages;
}
