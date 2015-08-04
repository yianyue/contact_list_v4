# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  # convert all contacts to json
  content_type :json
  Contact.all.to_json  
end