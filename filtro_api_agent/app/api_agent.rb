require 'sinatra'
require 'json'
require './lib/crawler'

before do
  content_type :json
  # headers "Content-Type" => "text/html; charset=utf-8"
  headers 'Access-Control-Allow-Origin' => '*',
          'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST'],
          'Access-Control-Allow-Headers' => 'Content-Type'
end

options '/getTweets' do
    200
end

get '/getTweets' do
  crawler = CrawlerHelper.new
  response = crawler.crawl("tech")
  puts response
  response.to_json
end

post '/getTweets' do
  puts "call successful:: Getting Tweets"
  begin
      params.merge! JSON.parse(request.env["rack.input"].read)
  rescue JSON::ParserError
      logger.error "Cannot parse request body." 
  end
  puts params[:searchTerm]
  crawler = CrawlerHelper.new
  response = crawler.crawl(params[:searchTerm])
  puts response
  return response
  #{result: params[:message]}.to_json

end