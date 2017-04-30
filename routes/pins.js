var models;

var PinRoutes = function(appModels){
    models = appModels;
};

PinRoutes.prototype.index = function(req, res) {
    models.pin.getAllPins(options = {}, function(err, pins){
        if(err) throw err;
        res.render('pins/index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: { title: 'All Pins' },
            path: 'pins',
            pins: pins
        });
    });
}

PinRoutes.prototype.create = function(req, res) {
    var title = req.body.title;
    var image = req.body.image;

    // Validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('image', 'Image is required').notEmpty();

    var errors = req.validationErrors();

    var pinToBeCreated = new models.pin.Pin({
        title: title,
        image: image,
        user: req.user._id
    });

    // Check for validation errors & update user
    if (!errors){
        models.pin.createPin(pinToBeCreated, function(error, pin) {
            if (error) { return res.status(500).json({status: 500, error: true, message: error }); }
            res.status(200).json({
                status: 200,
                error: false,
                message: "Your Pin Was Successfully Added"
            });
        });
    } else {
        res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) });
    }
}

PinRoutes.prototype.removePinById = function(req, res) {
    var options = {};
    options.pinId = req.params.id;

    if(options && options.pinId){
        models.pin.removePinById(options, function(error, pin){
            if (error) { return res.status(500).json({status: 500, error: true, message: error }); }
            res.status(200).json({
                status: 200,
                error: false,
                message: "Pin Successfully Removed!"
            });
        });
    } else {
        res.status(400).json({ status: 400, error: true, message: 'Bad Request' });
    }
}

module.exports = PinRoutes;
