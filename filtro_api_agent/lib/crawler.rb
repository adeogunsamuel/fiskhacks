require 'open-uri'
require 'nokogiri'

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
    return twitter_accounts

  end

end