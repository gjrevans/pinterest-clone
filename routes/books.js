var models;

var BookRoutes = function(appModels){
    models = appModels;
};

BookRoutes.prototype.index = function(req, res) {
    var options = {};
    var ownedBooks = [];

    // Get all available books
    models.book.getBooks(options, function(err, books){
        if(err) throw err;
        // If signed in, also fetch the current user's books
        if(req.user) {
            options.userId = req.user.id;
            models.book.getBooksByUserId(options, function(err, ownedBooks){
                if(err) throw err;

                ownedBooks = ownedBooks;
                render(books, ownedBooks);
            });
        // Otherwise, just render the view
        } else {
            render(books, ownedBooks);
        }
    });
    // Render the view
    function render(books, ownedBooks){
        res.render('books/index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: { title: 'All Books' },
            path: 'books',
            ownedBooks: ownedBooks,
            books: books
        });
    }
}

BookRoutes.prototype.getBooksByUserId = function(req, res) {
    var options = {
        userId: req.params.userId
    }
    models.book.getBooksByUserId(options, function(error, books) {
        if(error) throw error;

        // Set the page breadcrumb
        req.breadcrumbs(req.user.username, '/users/update');
        req.breadcrumbs('My Books', '/users/' + options.userId + '/books');

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
            res.status(200).json({
                status: 200,
                error: false,
                message: "Your Book Was Successfully Added"
            });
        });
    } else {
        res.status(400).json({ status: 400, error: true, message: errors.map(error => " " + error.msg ) });
    }
}

BookRoutes.prototype.removeBookById = function(req, res) {
    var options = {
        bookId: req.params.id
    }
    if(options && options.bookId){
        models.book.removeBookById(options, function(error, bookRemoved){
            if(error) {
                return res.status(500).json({status: 500, error: true, message: error });
            }
            res.status(200).json({
                status: 200,
                error: false,
                message: "Book Successfully Removed!"
            });
        });
    } else {
        res.status(400).json({ status: 400, error: true, message: 'Bad Request' });
    }
}

module.exports = BookRoutes;
