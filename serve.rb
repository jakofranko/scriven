require 'sinatra'

set :public_folder, '.'
set :port, 8888


get '/' do
  File.read(File.join('.', 'index.html'))
end
