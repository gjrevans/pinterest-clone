var passport        = require('passport'),
LocalStrategy   = require('passport-local').Strategy,
models

var UserRoutes = function(appModels){
    models = appModels;
};

UserRoutes.prototype.registerView = function(req, res) {
    // Set the page breadcrumb
    req.breadcrumbs('Register', '/users/register');

    // Render the page
    res.render('users/register.html', {
        breadcrumbs: req.breadcrumbs(),
        page: { title: 'Register' },
        path: 'register'
    });
}

UserRoutes.prototype.register = function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        req.flash("errorMessages", errors);
        res.render('users/register.html', {
            page: { title: 'Register' }
        });
    } else {
        var newUser = new models.user.User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        models.user.createUser(newUser, function(err, user){
            if(err) throw err;
        });

        req.flash('successMessages', 'You are now registered & can login!');
        res.redirect('login');
    }
}

UserRoutes.prototype.loginView = function(req, res) {
    // Set the page breadcrumb
    req.breadcrumbs('Login', '/users/login');

    // Render the page
    res.render('users/login.html', {
        breadcrumbs: req.breadcrumbs(),
        page: { title: 'Login' },
        path: 'login'
    });
}

UserRoutes.prototype.login = function(req, res) {
    res.redirect('/');
}

UserRoutes.prototype.profileView = function(req, res) {
    var options = {};
    options.userId = req.params.userId;

    models.user.getUserById(options, function(err, user){
        if(err) throw err;

        req.breadcrumbs(user.name);

        models.pin.getPinsForUser(options, function(error, pins) {
            if(error) throw error;

            res.render('users/edit.html', {
                breadcrumbs: req.breadcrumbs(),
                page: { title: user.username + '\'s profile'},
                currentUser: user,
                pins: pins,
                path: 'edit'
            });
        });
    });
}

UserRoutes.prototype.update = function(req, res) {
    var name        = req.body.name;
    var email       = req.body.email;
    var username    = req.user.username;
    var city        = req.body.city;
    var state       = req.body.state;
    var password    = req.body.password;
    var password2   = req.body.password2;

    // Validate incoming data based on request type
    if(!password) {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
    } else {
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    }

    var errors = req.validationErrors();

    // Create our updated user object
    var userToBeUpdated = {};
    if(name) {
        userToBeUpdated.name = name;
    }
    if(username) {
        userToBeUpdated.username = username;
    }
    if(email) {
        userToBeUpdated.email = email;
    }
    if(city) {
        userToBeUpdated.city = city;
    }
    if(state) {
        userToBeUpdated.state = state;
    }
    if(password) {
        userToBeUpdated.password = password;
    }

    // Check for validation errors & update user
    if (!errors){
        models.user.updateUser(userToBeUpdated, function(error, user) {
            if(error) {
                return res.status(500).json({status: 500, error: true, message: error });
            }
            // If successful, return a 200 to the browser
            res.status(200).json({
                status: 200,
                error: false,
                message: "Successfuly Update User Profile"
            });
        });
    } else {
        return res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) });
    }
}

UserRoutes.prototype.logout = function(req, res) {
    req.logout();
    req.flash('successMessages', 'Successfully logged out!');
    req.session.destroy();
    res.redirect('/');
}

passport.use(new LocalStrategy(function(username, password, done) {
    models.user.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user) {
            return done(null, false, {message: 'Unknown User'});
        }

        models.user.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var options = { userId: id };

    models.user.getUserById(options, function(err, user) {
        if(err) throw err;
        done(err, user);
    });
});

module.exports = UserRoutes;
