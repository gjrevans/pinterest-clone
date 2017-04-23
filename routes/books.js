var models;

var BookRoutes = function(appModels){
    models = appModels;
};

BookRoutes.prototype.index = function(req, res) {
    models.book.getBooks(function(err, books){
        if(err) throw err;

        res.render('books/index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: { title: 'All Books' },
            path: 'books',
            books: books
        });
    });
}

BookRoutes.prototype.create = function(req, res) {
    var title = req.body.title;
    var summary = req.body.summary;
    var image = req.body.image;

    // Validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('summary', 'Summary is required').notEmpty();
    req.checkBody('image', 'Image is required').notEmpty();

    var errors = req.validationErrors();

    var bookToBeCreated = new models.book.Book({
        title: title,
        summary: summary,
        image: image,
        user: req.user._id
    });

    // Check for validation errors & update user
    if (!errors){
        models.book.createBook(bookToBeCreated, function(error, book) {
            if(error) {
                return res.status(500).json({status: 500, error: true, message: error });
            }
            // If successful, return a 200 to the browser
            res.status(200).json({
                status: 200,
                error: false,
                message: "Your Book Was Successfully Added"
            });
        });
    } else {
        return res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) });
    }
}
module.exports = BookRoutes;
