var mongoose    = require('mongoose');
var bcrypt      = require('bcryptjs');
var validator   = require('validator');
var User;

var UserModel = function(){
    User = this.User = mongoose.model('User', UserSchema);
};

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

UserModel.prototype.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

UserModel.prototype.updateUser = function(userToBeUpdated, callback){
    var query = { username: userToBeUpdated.username }
    var updateData = {
        $set: {}
    };

    if(userToBeUpdated.name) {
        updateData.$set.name = userToBeUpdated.name
    }
    if(userToBeUpdated.city) {
        updateData.$set.city = userToBeUpdated.city;
    }
    if(userToBeUpdated.state) {
        updateData.$set.state = userToBeUpdated.state;
    }

    // If there is a password in the request, create a hash with bcrypt & update
    if(userToBeUpdated.password) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userToBeUpdated.password, salt, function(err, hash) {
                updateData.$set.password = hash;
                User.findOneAndUpdate(query, updateData, callback);
            });
        });
    } else {
        User.findOneAndUpdate(query, updateData, callback);
    }
}

UserModel.prototype.getUserByUsername = function(username, callback){
    var query = { username: username }
    User.findOne(query, callback);
}

UserModel.prototype.getUserById = function(options, callback){
    var id = options.userId;
    // Make sure we're passing a mongo id
    if(!id || !validator.isMongoId(id)){
        console.log('getUserById');
        return callback("invalidId", false);
    }
    User.findById(id, callback);
}

UserModel.prototype.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports = UserModel;
