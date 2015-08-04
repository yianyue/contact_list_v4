# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  # convert all contacts to json
  content_type :json
  Contact.all.to_json  
end

post '/contacts' do
  @contact = Contact.new.from_json(data)
  @contact.save!
end