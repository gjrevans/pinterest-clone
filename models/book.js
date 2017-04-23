var mongoose = require('mongoose'),
    Book;

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

BookModel.prototype.getBooks = function(callback){
    Book.find(callback);
}

BookModel.prototype.createBook = function(bookToBeCreated, callback){
    bookToBeCreated.save(bookToBeCreated, callback);
}

module.exports = BookModel;
