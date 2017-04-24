var models;
var io;

var TradeRoutes = function(appModels, appIo){
    models = appModels;
    io = appIo;
};

TradeRoutes.prototype.create = function(req, res) {
    var bookOfferedId = req.body.id;
    var bookInterestedId = req.params.id;

    req.checkBody('bookOffered', 'You must provide the book you\'re offering!');
    req.checkBody('bookInterested', 'You must provide the book you\'re interested in!');

    var validationErrors = req.validationErrors();

    var tradeToBeCreated = new models.trade.Trade({
        bookOffered: {},
        bookInterested: {}
    });

    // Find the book being offered
    if(!validationErrors){
        models.book.getBookById(bookOfferedId, function(err, foundBookOffered) {
            if(err) throw err;
            tradeToBeCreated.bookOffered = foundBookOffered;
            tradeToBeCreated.offeringUser = foundBookOffered.user;

            // Find the book the user is interested in
            models.book.getBookById(bookInterestedId, function(errr, foundBookInterested){
                if(errr) throw errr;
                tradeToBeCreated.bookInterested = foundBookInterested;
                tradeToBeCreated.interestedUser = foundBookInterested.user;
                // Create the new trade
                models.trade.createTrade(tradeToBeCreated, function(error, trade){
                    if(error) { return res.status(500).json({ status: 500, error: true, message: error }); }

                    io.sockets.emit('trade added', { trade: trade });
                    res.status(200).json({
                        status: 200,
                        error: false,
                        message: "Your trade request was submitted successfully!"
                    });
                });
            });
        });
    } else {
        return res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) })
    }
}

TradeRoutes.prototype.getTradeCounts = function(req, res) {
    var options = {}
    var counts = {};

    options.userId = req.params.userId;
    options.count = true;

    if(options && options.userId){
        // First get the incoming count
        models.trade.getIncomingTradesByUserId(options, function(err, incomingCount){
            if(err) {
                return res.status(500).json({status: 500, error: true, message: 'Couldn\'t get counts.'});
            }
            counts.incoming = incomingCount.length;

            // Then get the outgoing count
            models.trade.getOutgoingTradesByUserId(options, function(errr, outgoingCount){
                if(errr) {
                    return req.status(500).json({tatus: 500, error: true, message: 'Couldn\'t get counts.'});
                }
                counts.outgoing = outgoingCount.length;
                res.status(200).json({
                    status: 200,
                    message: 'Message counts successfully fetched',
                    data: counts
                });
            });
        });
    } else {
        return res.status(400).json({status: 400, error: true, message: "Bad Request"});
    }

}

TradeRoutes.prototype.cancelTrade = function(req, res) {
    var options = {
        tradeId: req.params.id
    }

    if(options && options.tradeId){
        models.trade.cancelTradeById(options, function(error, canceledTrade){
            if (error) {
                return res.status(500).json({ status: 500, error: true, message: error });
            }
            res.status(200).json({ status: 200, message: "Trade successfully removed!" });
        });
    } else {
        return res.status(400).json({ status: 400, error: true, message: 'Missing trade ID!' });
    }
}

TradeRoutes.prototype.updateTrade = function(req, res) {
    var options = {};
    options.tradeStatus = req.body.status;
    options.tradeId = req.params.id;

    req.checkBody('tradeStatus', 'You must provide a trade status!');
    req.checkBody('tradeId', 'You must provide a trade id!');

    var errors = req.validationErrors();
    if(!errors){
        models.trade.updateTradeById(options, function(error, updatedTrade){
            if (error) {
                return res.status(500).json({ status: 500, error: true, message: error });
            }
            res.status(200).json({ status: 200, message: "Trade successfully updated" });
        });

    } else {
        res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) })
    }
}

TradeRoutes.prototype.getIncomingTrades = function(req, res) {
    var options = {};
    options.userId = req.user.id;
    options.count = false;

    models.trade.getIncomingTradesByUserId(options, function(error, foundTrades){
        if (error) throw error;

        req.breadcrumbs(req.user.username, '/users/update');
        req.breadcrumbs('Incoming Trades', '/incoming_trades');

        res.render('trades/incoming.html', {
            page: {title: 'Incoming Trades'},
            breadcrumbs: req.breadcrumbs(),
            trades: foundTrades
        });
    })
}

TradeRoutes.prototype.getOutgoingTrades = function(req, res) {
    var options = {};
    options.userId = req.user.id;
    options.count = false;

    models.trade.getOutgoingTradesByUserId(options, function(error, foundTrades){
        if (error) throw error;

        req.breadcrumbs(req.user.username, '/users/update');
        req.breadcrumbs('Outgoing Trades', '/outgoing_trades');
        res.render('trades/outgoing.html', {
            page: {title: 'Outgoing Trades'},
            breadcrumbs: req.breadcrumbs(),
            trades: foundTrades
        });
    })
}
module.exports = TradeRoutes;
