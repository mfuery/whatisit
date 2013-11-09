////////// Server only logic //////////
var cheerio = Npm.require('cheerio');

// Methods
Meteor.methods({
    downloadUrl: function(url, user_id) {
        var result = Meteor.http.get(url, {
        });
        if(result.error) {
            throw result.error;
        }

        var $ = cheerio.load(result.content);
        $('link, img').each(function(){
            var $this = $(this),
                hasFullPath = /\/\/\w*\.?\w+.\w+/,
                href;
            if (href = $this.attr('href')) {
                if (href.search(hasFullPath) === -1) {
                    $this.attr('href', url + href);
                }
            } else {
                var src = $this.attr('src');
                if (src.search(hasFullPath) == -1) {
                    $this.attr('src', url + src);
                }
            }
        });

        CachedUrls.insert({
            url: url,
            user_id: user_id,
            content: result.content,
            head: $('head').html(),
            body: $('body').html(),
            timestamp: Date.now()
        });

        return result;
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
        group_id: 1
    });

    console.log('user', user);
    return user;
});
