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
   @contact = Contact.new(params[:contact]) # both symbol and string as params key work
   @contact.save
   @contact.to_json
end

delete '/contacts/:id' do
  @contact = Contact.find(params[:id])
end