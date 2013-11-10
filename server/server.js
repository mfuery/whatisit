////////// Server only logic //////////
var cheerio = Npm.require('cheerio');

DEFAULT_GROUP_ID = 1;

// Methods
Meteor.methods({
    downloadUrl: function(url, user_id, group_id) {
        var result = Meteor.http.get(url, {
        });
        if(result.error) {
            throw result.error;
        }
        console.log(result);
        var $ = cheerio.load(result.content);
        $('link, img').each(function(){
            var $this = $(this),
                hasFullPath = /\/\/\w*\.?\w+.\w+/,
                href, src;
            if ((href = $this.attr('href'))) {
                if (href.search(hasFullPath) === -1) {
                    $this.attr('href', url + href);
                }
            } else {
                if ((src = $this.attr('src'))) {
                    if (src.search(hasFullPath) === -1) {
                        console.log(src);
                        $this.attr('src', url + src);
                    }
                }
            }
        });
        var scripts = [];
        $('script').each(function(){
           var $this = $(this),
                hasFullPath = /\/\/\w*\.?\w+.\w+/,
                src, scriptTag;
            src = $this.attr('src');
            if (src) {
                if (src.search(hasFullPath) === -1) {
                    console.log(src);
                    $this.attr('src', url + src);
                }
            }
            scriptTag = {
                src: $this.attr('src'),
                html: $this.html()
            };
            scripts.push(scriptTag);
            $this.remove();
        });

        var page_id = Pages.insert({
            url: url,
            user_id: user_id,
            content: result.content,
            head: $('head').html(),
            body: $('body').html(),
            scripts: scripts,
            timestamp: Date.now(),
            group_id: group_id || DEFAULT_GROUP_ID
        });

        return page_id;
    },

    saveChatRoom: function(name, page_id, group_id) {
        var _id = ChatRooms.insert({
            user_id: Meteor.userId(),
            name: name,
            page_id: page_id,
            timestamp: Date.now(),
            group_id: group_id || DEFAULT_GROUP_ID
        });
        Meteor.call('saveChatMessage', _id, 'Chat started', page_id, group_id);
        return _id;
    },

    saveChatMessage: function(chat_room_id, msg, page_id, group_id) {
        var _id = ChatMessages.insert({
            user_id: Meteor.userId(),
            chat_room_id: chat_room_id,
            message: msg,
            page_id: page_id,
            timestamp: Date.now(),
            group_id: group_id || DEFAULT_GROUP_ID
        });
        return _id;
    },

    savePageEdit: function(page_id) {
    },

    'visitor.update': function(visitor_id, page_id) {
        /* { jnJbhD937Hnd: {visits: 1} } */

        // Validate visitor exists. Insert if NE
        if (!visitor_id || !Visitors.find({_id: visitor_id})) {
            visitor_id = Visitors.insert({
                stats: {},
                transactions: []
            });
            console.log('visitor_id: '+visitor_id);
        }

        // Visitor data
        var updateObj = {
            $push: {
                transactions: {
                    page_id: page_id,
                    timestamp: Date.now()
                }
            },
            $inc: {}
        };
        if (page_id) {
            // we should always have page_id, though.
            var key = 'stats.' + page_id + '.visits';
            updateObj.$inc[key] = 1;
        }
        Visitors.update({
            _id: visitor_id
        }, updateObj);


        var v = Visitors.find().fetch().pop();
        if (v) {
            console.log('visitor_id', v._id, v.stats);
            //console.log(v.transactions);
        }
        //console.log('ALL:');
        //console.log(Visitors.find().fetch());

        return visitor_id;
    }
});

Accounts.config({
    sendVerificationEmail: false
});
Accounts.loginServiceConfiguration.remove({
    service: ""
});
Accounts.loginServiceConfiguration.insert({
    service: "",
    appId: "",
    secret: ""
});

Accounts.onCreateUser(function(options, user) {
    user.profile = _.extend({}, options.profile, {
        group_id: DEFAULT_GROUP_ID
    });

    console.log('user', user);
    return user;
});
