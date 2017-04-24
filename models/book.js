var validator   = require('validator');
var mongoose    = require('mongoose');
var Book;

var BookModel = function(){
    Book = this.Book = mongoose.model('Book', BookSchema);
};

var BookSchema = mongoose.Schema({
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
});

BookModel.prototype.getBooks = function(options, callback) {
    Book.find(callback);
}

BookModel.prototype.getBooksByUserId = function(options, callback) {
    var id = options.userId;

    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }
    Book.find({ user: id }, callback);
}

BookModel.prototype.getBookById = function(id, callback) {
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }
    Book.findById(id, callback);
}

BookModel.prototype.createBook = function(bookToBeCreated, callback) {
    bookToBeCreated.save(bookToBeCreated, callback);
}

BookModel.prototype.removeBookById = function(options, callback) {
    var id = options.bookId;
    
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }

    Book.findOneAndRemove(options.id, callback);
}

module.exports = BookModel;
