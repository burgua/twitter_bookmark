$(function(){

  var marked = "tb-marked-tweet";

  // init db, 1 Mb
  // FAIL HERE?????
  var db = openDatabase('extensions-twitter-bookmark', '1.0', '', 1024*1024);

  // sql-wrapper for html5 sqlite storage
  function sql (query, callback) {
    db.transaction(function (tx) {
      tx.executeSql(query, [], function (tx, results) {
        callback && callback(results);
      });
    });
  }

  // create table ( runs only once )
  sql ('CREATE TABLE IF NOT EXISTS bookmarks ( id INTEGER PRIMARY KEY ASC, tweetid TEXT UNIQUE )');

  // create control UI
  $("#global-actions").
    append($("<li><a href='#'>Set Bookmark</a></li>").attr("id","tb-bookmark")).
    append($("<li><a href='#'>Goto Bookmark</a></li>").attr("id","tb-goto-bookmark"));

  // get last extracted id
  // real crapy query ((
  sql ('SELECT * FROM bookmarks ORDER by id DESC LIMIT 1', function (results) {
    var lastTweetId = results.rows.item(0).tweetid;
    lastTweetId && decorateLastBookmark ( $('[data-tweet-id="'+lastTweetId+'"]') );
  })

  // mark last read tweet
  function decorateLastBookmark (el) {
    $("."+marked).removeClass(marked);
    el.addClass(marked);
  }

  // create bookmark element and handler for click
  $("#tb-bookmark").click(function(){
    var currentTweet = $(".tweet").first();
    var tweetId = currentTweet.attr("data-tweet-id");
    sql ("INSERT INTO bookmarks (tweetid) VALUES ("+tweetId+") ");
    decorateLastBookmark ( currentTweet ) ;
  });

  $("#tb-goto-bookmark").click(function(){
    $.scrollTo($("."+marked).first());
  });

});

