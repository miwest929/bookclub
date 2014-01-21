/*
  object element defines an embedded object in your html document.
*/
App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Book = Ember.Object.extend({
  title: "Not specified",
  author: "Not specified",
  pagesRead: 0,
  pagesTotal: 0,
  percentage: function() {
    if (this.get('pagesTotal') !== 0) {
      return (this.get('pagesRead') / this.get('pagesTotal') * 100.0).toFixed(1);
    }
    else {
      return 0;
    }
  }.property('pagesRead', 'pagesTotal')
});
var books = Em.A();

var isNormalInt = function(s) {
  var n = ~~Number(s);
  return String(n) === s && n >= 0;
}

App.Router.map(function() {
  this.resource('books', function() {
    this.resource('book', {path: '/:book_id'});
  });
});

App.BooksRoute = Ember.Route.extend({
  model: function() {
    return books;
  }
});

App.BookRoute = Ember.Route.extend({
  model: function(params) {
    return findBy("id", params.book_id);
  },
  setupController: function(controller, book) {
    controller.set('model', book);
  }
});

App.BookController = Ember.ObjectController.extend({
  actions: {
    report: function() {
      value = this.get('newPages');
      if (value && isNormalInt(value)) {
        this.get('model').set('pagesRead', value);
        this.set('errors', undefined);
      } else {
        this.set('errors', "Pages must be a proper integer!");
      }

      this.set('newPages', '');
    }
  }
});

App.BooksController = Ember.ArrayController.extend({
  actions: {
    addNewBook: function() {
      var title = this.get("title");
      var author = this.get("author");
      var pagesTotal = this.get("pagesTotal"); 

      if (title && author && pagesTotal) {
        $.ajax({
          url: 'http://localhost:9494/book',
          type: 'post',
          data: {
            title: title,
            author: author,
            pagesTotal: pagesTotal
          },
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          dataType: 'json',
          success: function (data) {
            console.info(data);
          }
        });

        books.pushObject(App.Book.create({
          id: books.length,
          title: title,
          author: author,
          pagesTotal: pagesTotal,
          pagesRead: 0
        }));
        this.set("title", "");
        this.set("author", "");
        this.set("pagesTotal", "");
        this.set("errors", undefined);
      } else {
        if (!title) {
          this.set("errors", "Must provide a book title");
        }
        if (!author) {
          this.set("errors", "Must provide an author for the book");
        }
        if (!pagesTotal) {
          this.set("errors", "Must provide the total number of pages");
        } 
      }
    }
  }
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('books');
  }
});

App.BookView = Ember.View.extend({
  templateName: "book",
  tagName: "li",
  classNames: ['book-info']
});

$.getJSON("http://localhost:9494/books").then(
  function(response) {
    response.data.forEach(function(b) {
      var book = App.Book.create({
        id: b["id"],
        title: b["title"],
        author: b["author"],
        pagesTotal: b["pagesTotal"]
      });

      var pagesRead = 0;
      b.readings.forEach(function(r) {
        pagesRead += r["pagesCount"]
      });
      book["pagesRead"] = pagesRead;

      books.pushObject(book);
    });
  }
);
