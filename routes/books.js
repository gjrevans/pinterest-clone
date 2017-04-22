var models;

var BookRoutes = function(appModels){
    models = appModels;
};

BookRoutes.prototype.index = function(req, res) {
    var books = [{
        title: "Managing Humans",
        summary: "This is a really great book, that everyone will like.",
        image: "https://images-na.ssl-images-amazon.com/images/I/61aY1f%2Btn6L._SY344_BO1,204,203,200_.jpg",
        _id: "1234"
    }]
    res.render('books/index.html', {
        breadcrumbs: req.breadcrumbs(),
        page: { title: 'All Books' },
        path: 'books',
        books: books
    });
}
module.exports = BookRoutes;
