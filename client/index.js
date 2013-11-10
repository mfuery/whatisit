
// Globally available
Handlebars.registerHelper("isLoggedIn", function() {
    return !!Meteor.userId();
});
var DateFormats = {
    short: "HH:mm:ss",
    long: "dddd DD/MM/YYYY HH:mm"
};
Handlebars.registerHelper("formatDate", function(timestamp, format) {
    if (moment) {
        var f = DateFormats[format];
        return moment(timestamp).format(f);
    } else {
        return timestamp;
    }
});

Template.urlList.cached_urls = function () {
    var pages = Pages.find({}).fetch();
    return pages;
};

function Test(e) {}


//Template.previewhead.preview = function() {
//    var cachedUrls = CachedUrls.find({}).fetch();
//    return cachedUrls[0];
//};

Template.preview.webpage = function() {
    var pages = Pages.find({}).fetch();
    return pages[0];
};

function positionMenu($element) {
    var menu = $('#menu'),
        pos = $element.offset(),
        width = $element.outerWidth();
    menu.css({
        position: "absolute",
        top: (pos.top - 19) + "px",
        left: pos.left + "px"
    }).show();
}

var highlighted = null;
var clicked = false;
Template.preview.events({
    'mouseenter div': function(e) {
        if (!clicked) {
            var target = $(e.target);

            if (highlighted) {
                $(highlighted).removeClass('highlight');
            }
            highlighted = e.target;
            $(highlighted).addClass('highlight');
            positionMenu(target);
        }
    },
    'click': function(e) {
        e.preventDefault();
        clicked = !clicked;
    },
    'mouseleave #preview': function(e) {
        if(highlighted) {
            $(highlighted).removeClass('highlight');
        }
        $('#menu').hide();
    }
});

function domWalk(element, direction) {
    var $highlighted = $(element),
        newDom;
    $highlighted.removeClass('highlight');
    switch(direction) {
        case 'left':
        newDom = $highlighted.prev();
        break;
        case 'right':
        newDom = $highlighted.next();
        break;
        case 'up':
        newDom = $highlighted.parent();
        break;
        case 'down':
        newDom = $highlighted.children().first();
        break;
        default:
        throw new Error;
    }
    highlighted = newDom.get(0);
    newDom.addClass('highlight');
    positionMenu(newDom);
    return newDom;
}

Template.menu.events({
    'click .glyphicon-arrow-left': function(e){
        e.preventDefault();
        clicked = true;
        if (highlighted) {
            var element = domWalk(highlighted, 'left');
        }
    },
    'click .glyphicon-arrow-right': function(e){
        e.preventDefault();
        clicked = true;
        if (highlighted) {
            var element = domWalk(highlighted, 'right');
        }
    },
    'click .glyphicon-arrow-up': function(e){
        e.preventDefault();
        clicked = true;
        if (highlighted) {
            var element = domWalk(highlighted, 'up');
        }
    },
    'click .glyphicon-arrow-down': function(e){
        e.preventDefault();
        clicked = true;
        if (highlighted) {
            var element = domWalk(highlighted, 'down');
        }
    },
    'click #edit': function(e){
        e.preventDefault();
        $('#navigation-assist').hide();
        $('#edit-tools').show();
    },
    'click #go': function(e) {
        e.preventDefault();
        var $select = $('#edit-tools').find('select'),
            type = $select.first().val(),
            position = $select.last().val();
        if (type && position) {
            var $highlighted = $(highlighted);
            switch(type) {
                case "ab":
                $highlighted[position]('<div></div>');
                break;
                case "post":
                $highlighted[position]('<div></div>');
                break;
                case "html":
                $highlighted[position]('<div></div>');
                break;
                default:
                throw new Error;
            }
        }

        // TODO here
        Meteor.call('savePageEdit', Session.get('page_id'));
    },
    'click #save': function(e){
        e.preventDefault();
    },
    'click #cancel': function(e){
        e.preventDefault();
        $('#edit-tools').hide();
        $('#navigation-assist').show();
    }
});

Meteor.startup(function () {
    // code to run on client load (not necessarily dom ready)

    Deps.autorun(function () {
        if (Meteor.userId()) {
            Meteor.subscribe('pages');
            Meteor.subscribe('chat_rooms');

            if (Session.get('chat_room_id')) {
                Meteor.subscribe('chat_messages', Session.get('chat_room_id'));
            }
        }
    });
});

$(document).ready(function() {
    $('#menu').hide();
//    $('.nav a').each(function(i, el){
//        $(el).parent('li').on('click', function(){
//            $(this).addClass('active');
//        });
//    });
});

// to set a callback to run before any routing function. Useful to reset session variables.
//Meteor.Router.beforeRouting = function() {
//    $('.nav li').each(function(i, el){
//        $(el).removeClass('active');
//    });
//};



Meteor.Router.add({
    '/': 'landingPage',
    '/learn': 'learnPage',
    '/dash': function() {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        return 'dashboardPage';
    },
    '/page/:page_id': function(page_id) {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        Session.set('page_id', page_id);
        return 'dashboardPage';
    },
    '/chat': function() {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        return 'chatList';
    },
    '/chat/:chat_room_id': function(chat_room_id) {
        if (!Meteor.userId()) {
            Meteor.Router.to('/');
            return 'landingPage';
        }
        Session.set('chat_room_id', chat_room_id);
        return 'chatList';
    },
    '/mass-mail': 'massmailPage',
    '*': 'not_found'
});
