

Template.page.isUserLoggedIn = function() {
    console.log(!!Meteor.userId())
    return !!Meteor.userId();
}


Template.urlList.cached_urls = function () {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls;
};

function Test(e) {}

Template.downloadUrl.events({
    'submit #fetch-url-form' : function (e) {
        var url = $('#url-input').val().trim();
        //$(evt.target).val('');
        console.log(e);
        Meteor.call('downloadUrl', url, Meteor.userId());
        return false;
    },
});

//Template.previewhead.preview = function() {
//    var cachedUrls = CachedUrls.find({}).fetch();
//    return cachedUrls[0];
//};

Template.preview.webpage = function() {
    var cachedUrls = CachedUrls.find({}).fetch();
    return cachedUrls[0];
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
    }
});

Meteor.startup(function () {
    // code to run on client load (not necessarily dom ready)
    
    Meteor.subscribe('cached_urls', Meteor.userId());
});

$(document).ready(function() {
    $('#menu').hide();
});

Meteor.Router.add({
    '/': 'landingPage',
    '/learn': 'learnPage',
    '/dash': function() {
        return Meteor.userId() ? 'dashboardPage' : 'landingPage';
    },
    '*': 'not_found'
});
