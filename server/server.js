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

        CachedUrls.insert({
            url: url,
            user_id: user_id,
            content: result.content,
            head: $('head').html(),
            body: $('body').html()
        });


        return result;
    },
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
    console.log('user', user);
    return user;
});
