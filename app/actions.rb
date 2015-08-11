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
  @contact.save
  content_type :json
  @contact.to_json # only really need the id
end

put '/contacts' do
  @contact = Contact.find(params[:contact][:id])
  @contact.update(params[:contact])
  content_type :json
  @contact.to_json
end

delete '/contacts/:id' do
  @contact = Contact.find(params[:id])
  if @contact.destroy
    params[:id]
  end
end