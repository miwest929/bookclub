require 'sinatra'
require 'json'
require 'active_record'
require 'debugger'

connection = ActiveRecord::Base.establish_connection(
  adapter: "mysql2",
  host: "localhost",
  username: "root",
  password: "",
  database: "bookclub_development"
)

set :port, 9494

get '/books' do
  headers["Access-Control-Allow-Origin"] = "*"

  readings = connection.connection.execute("SELECT r.book_id, r.entered_at, r.pagesCount FROM books b JOIN readings r ON b.id = r.book_id")
  books = connection.connection.execute("SELECT * from books")
  data = [] 
  books.each do |b|
    data << {
      id: b.shift,
      title: b.shift,
      author: b.shift,
      pagesTotal: b.shift,
      readings: []
    }
  end

  readings.each do |r|
    data[r.shift.to_i - 1][:readings] << {date: r.shift, pagesCount: r.shift} 
  end

  JSON.generate({data: data})
end

post '/book' do
  headers["Access-Control-Allow-Origin"] = "*"
  JSON.generate({error: "I dont know"})
end
