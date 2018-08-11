require 'sinatra'

set :public_folder, '.'
set :bind, '0.0.0.0'
set :port, 8080


get '/' do
  File.read(File.join('.', 'index.html'))
end
