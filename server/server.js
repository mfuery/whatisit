////////// Server only logic //////////

// Methods
Meteor.methods({
    downloadUrl: function(url, user_id) {
        var result = Meteor.http.get(url, {
        });
        if(result.error) {
            throw result.error;
        }

        CachedUrls.insert({
            url: url,
            user_id: user_id,
            content: result.content
        });
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
    console.log('user', user);
    return user;
});
