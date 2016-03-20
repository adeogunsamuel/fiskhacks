  require 'open-uri'
  require 'nokogiri'
  require 'unidecoder'

  class CrawlerHelper
    BASE_URL = "https://www.twitter.com/"

    def crawl(search_term)
      if !search_term.downcase().include? "news"
         search_term += " news"
      end
      search_term = URI::encode(search_term)

      twitter_accounts = []; # array containing a list of relevant twitter accounts
      twitter_account_result = Nokogiri::HTML(open("#{BASE_URL}search?f=users&vertical=news&q=#{search_term}&src=typd"))
      twitter_account_result.css('div.Grid-cell.u-size1of2.u-lg-size1of3.u-mb10').map do |each_account|
        twitter_accounts.push(each_account.css('a.ProfileNameTruncated-link.u-textInheritColor.js-nav.js-action-profile-name').attr('href').text)
      end

      return JSON.pretty_generate(crawlTweetsFromAccounts(twitter_accounts))

    end

    def get_tweets(twitter_accounts, accounts_result, i)
      each_account = Nokogiri::HTML(open("#{BASE_URL}#{twitter_accounts[i]}"))
      name = each_account.css('a.ProfileHeaderCard-nameLink.u-textInheritColor.js-nav').text
      puts "name: #{name}"
      thumbnail = each_account.css('img.ProfileAvatar-image').attr('src').text
      tweets = []
      each_account.css('p.TweetTextSize.TweetTextSize--16px.js-tweet-text.tweet-text').map do |each_tweet|
        tweets.push(each_tweet.text.to_ascii)
      end
      accounts_result[i] = {"name" => name, "tweets" => tweets, "thumbnail" => thumbnail}
      
    end

    def crawlTweetsFromAccounts(twitter_accounts) 
      accounts_thread = Array.new(twitter_accounts.size);
      accounts_result = Array.new(twitter_accounts.size);
      i = 0
      while (i < accounts_thread.size)
          accounts_thread[i] = Thread.new {get_tweets(twitter_accounts, accounts_result, i)};
          sleep (1.0/500.0)
          i += 1
      end
      accounts_thread.each do |each_thread|
        each_thread.join 
      end
      accounts_result.each do |each_result|
        puts each_result
      end
      return accounts_result

    end

  end