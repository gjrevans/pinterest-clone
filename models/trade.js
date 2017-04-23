var validator   = require('validator');
var mongoose    = require('mongoose');
var Trade;

var TradeModel = function(){
    Trade = this.Trade = mongoose.model('Trade', TradeSchema);
};

var TradeSchema = mongoose.Schema({
    status: {
        type: String,
        default: 'pending'
    },
    bookOffered: {
        title: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            required: true
        }
    },
    bookInterested: {
        title: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.ObjectId,
            required: true
        }
    }
});

TradeModel.prototype.createTrade = function(newTrade, callback) {
    newTrade.save(callback);
}

TradeModel.prototype.cancelTradeById = function(id, callback) {
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }

    Trade.findOneAndRemove(id, callback);
}

TradeModel.prototype.updateTradeById = function(options, callback) {
    var id = options.tradeId;

    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }

    var query = { _id: id };
    var update = {
        $set: {
            status: options.tradeStatus
        }
    }

    Trade.findOneAndUpdate(query, update, callback);
}

TradeModel.prototype.getIncomingTradesByUserId = function(id, callback) {
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }

    Trade.find({ 'bookInterested.user': id }, callback);
}

TradeModel.prototype.getOutgoingTradesByUserId = function(id, callback) {
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }

    Trade.find({ 'bookOffered.user': id }, callback);
}

module.exports = TradeModel;
