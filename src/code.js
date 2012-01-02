$(function(){

  var marked = "tb-marked-tweet"

  // mark last read tweet
  function decorateLastBookmark (el) {
    el.addClass(marked);
  }

  // create bookmark element and handler for click
  $("body").append($("<div></div>").attr("id","tb-bookmark").click(function(){
    var currentTweet = $(".tweet").first();
    //var tweetId = currentTweet.data("tweet-id");
    decorateLastBookmark ( currentTweet ) ;
  }));

  // scroll to bookmark
  $("body").append($("<div></div>").attr("id","tb-goto-bookmark").click(function(){
    $.scrollTo($("."+marked).first());
  }));

});

