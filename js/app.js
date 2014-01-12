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
  pagesTotal: 0
});
var books = Em.A();

//Create books data
var reading_data = [{
  title: "Darwin among the Machines",
  author: "George Dyson",
  pagesRead: 36,
  pagesTotal: 278
},
{
  title: "A People's History of the United States",
  author: "Howard Zinn",
  pagesRead: 96,
  pagesTotal: 688
},
{
  title: "Algorithmic Graph Theory",
  author: "Alan Gibbons",
  pagesRead: 35,
  pagesTotal: 252
},
{
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

App.BooksController = Ember.ArrayController.extend({
  sortProperties: ['pagesRead'],
  sortAscending: false
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('books');
  }
});
