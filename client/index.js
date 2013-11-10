
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

Template.urlList.pages = function () {
    var pages = Pages.find({
        //group_id: 1 // TODO
    }).fetch();
    return pages;
};

function Test(e) {}


Template.page.isVisitorPage = function() {
    var url = (window.location.pathname + '').match(/\/page\/([a-z0-9]+)/i);
    var page_id;
    if (url && url[1]) {
        page_id = url[1];
    }
    Session.set('page_id', page_id);
    return (!User.getId() && page_id);
}


//Template.previewhead.preview = function() {
//    var cachedUrls = CachedUrls.find({}).fetch();
//    return cachedUrls[0];
//};

Template.preview.webpage = function() {
    var pages = Pages.find({}).fetch();
    return pages[0];
};

function appendJavascript(pages) {
    if (pages.length > 0) {
        console.log("pages", pages);
        var scripts = pages[0].scripts;
        for (var i = scripts.length - 1; i >= 0; i--) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scripts[i].src;
            $('body').append(script);
        };
    }
}

Template.preview.rendered = function() {
    var pages = Pages.find({}).fetch();
    appendJavascript(pages);
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
            //{ user_id, group_id, page_id, type }
            var content_id = Content.insert({
                page_id: Session.get('page_id'),
                group_id: User.getGroupId(),
                type: type
            }, function(error, content_id) {
                console.log(content_id);
                var newDiv = $('<div data-content="'+content_id+'">Post</div>')
                switch(type) {
                    case "ab":
                    $highlighted[position](newDiv);
                    break;
                    case "post":
                    $highlighted[position](newDiv);
                    break;
                    case "html":
                    $highlighted[position](newDiv);
                    break;
                    default:
                    throw new Error;
                }
                $('#edit-tools').hide();
                $('#navigation-assist').show();
            });
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

Template.visitorPage.webpage = function() {
    var edits = Pages.find({}).fetch();
    return edits[0];
};

Template.visitorPage.rendered = function() {
    var visitor_id = Cookie.get(AppCookie.visitor_id);
    var page_id = Session.get('page_id');
    var edits = Pages.find({}).fetch();
    Meteor.call('visitor.update', visitor_id, page_id, function(err, visitor_id) {
        if (Cookie.get(AppCookie.visitor_id)) {
            console.log('welcome back, visitor ' + visitor_id);
        } else {
            Cookie.set(AppCookie.visitor_id, visitor_id);
            console.log('hello, new visitor ' + visitor_id);
        }
    });
    appendJavascript(edits);
}

Meteor.startup(function () {
    // code to run on client load (not necessarily dom ready)

    Deps.autorun(function () {
        Meteor.subscribe('pages');

        if (Meteor.userId()) {
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
            if (Template.page.isVisitorPage()) {
                return 'visitorPage';
            }
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
