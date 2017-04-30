var validator   = require('validator');
var mongoose    = require('mongoose');
var Pin;

var PinModel = function(){
    Pin = this.Pin = mongoose.model('Pin', PinSchema);
};

var PinSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

PinModel.prototype.createPin = function(pinToBeCreated, callback) {
    pinToBeCreated.save(callback);
}

PinModel.prototype.getAllPins = function(options, callback) {
    Pin.find().populate('user').exec(callback);
}

PinModel.prototype.getPinById = function(id, callback) {
    if(!id || !validator.isMongoId(id)){
        console.log('getPinById');
        return callback("invalidId", false);
    }
    Pin.findById(id, callback);
}

PinModel.prototype.getPinsForUser = function(options, callback) {
    var id = options.userId;

    if(!id || !validator.isMongoId(id)){
        console.log('getPinsForUser');
        return callback("invalidId", false);
    }
    Pin.find({ user: id }, callback);
}

PinModel.prototype.removePinById = function(options, callback) {
    var id = options.pinId;

    if(!id || !validator.isMongoId(id)){
        console.log('removePinById');
        return callback("invalidId", false);
    }

    Pin.findOneAndRemove(id, callback);
}

module.exports = PinModel;
