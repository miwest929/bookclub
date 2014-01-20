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

//Create books data
// 1/11/2013 => 36
// 1/12/2013 => 38
var reading_data = [{
  id: "1",
  title: "Darwin among the Machines",
  author: "George Dyson",
  pagesRead: 38,
  pagesTotal: 278
},
{
  id: "2",
  title: "A People's History of the United States",
  author: "Howard Zinn",
  pagesRead: 96,
  pagesTotal: 688
},
{
  id: "3",
  title: "Algorithmic Graph Theory",
  author: "Alan Gibbons",
  pagesRead: 35,
  pagesTotal: 252
},
{
  id: "4",
  title: "The Ultimate Hitchhiker's Guide to the Galaxy",
  author: "Douglas Adams",
  pagesRead: 515,
  pagesTotal: 815
}];

for (index = 0; index < reading_data.length; index++) {
  books.pushObject(App.Book.create(reading_data[index]));
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
