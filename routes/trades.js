var models;

var TradeRoutes = function(appModels){
    models = appModels;
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
            // Find the book the user is interested in
            models.book.getBookById(bookInterestedId, function(errr, foundBookInterested){
                if(errr) throw errr;
                tradeToBeCreated.bookInterested = foundBookInterested;
                // Create the new trade
                models.trade.createTrade(tradeToBeCreated, function(error, trade){
                    if(error) { return res.status(500).json({ status: 500, error: true, message: error }); }
                    res.status(200).json({
                        status: 200,
                        error: false,
                        message: "Your trade request was submitted successfully!"
                    });
                });
            });
        });
    } else {
        res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) })
    }
}

TradeRoutes.prototype.incomingTrades = function(req, res) {
    var userId = req.user.id;

    models.trade.getIncomingTradesByUserId(userId, function(error, foundTrades){
        if (error) throw error;

        res.render('trades/incoming.html', {
            page: {title: 'Incoming Trades'},
            breadcrumbs: req.breadcrumbs(),
            trades: foundTrades
        });
    })
}

TradeRoutes.prototype.outgoingTrades = function(req, res) {
    var userId = req.user.id;

    models.trade.getOutgoingTradesByUserId(userId, function(error, foundTrades){
        if (error) throw error;

        res.render('trades/outgoing.html', {
            page: {title: 'Outgoing Trades'},
            breadcrumbs: req.breadcrumbs(),
            trades: foundTrades
        });
    })
}
module.exports = TradeRoutes;
