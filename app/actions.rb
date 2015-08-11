# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  content_type :json
  Contact.all.to_json  
end

get '/test' do
  erb :test, layout: false
end

post '/contacts' do
  @contact = Contact.new(params[:contact]) # both symbol and string as params key work
  content_type :json
  if @contact.save
    @contact.to_json # only really need the id
  else
    status 422
    @contact.errors.to_json
  end
end

put '/contacts' do
  @contact = Contact.find(params[:contact][:id])
  content_type :json
  if @contact.update(params[:contact])
    @contact.to_json
  else
    status 422
    @contact.errors.to_json
  end
end

delete '/contacts/:id' do
  @contact = Contact.find(params[:id])
  if @contact.destroy
    params[:id]
  end
end