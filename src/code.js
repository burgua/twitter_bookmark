$(function(){

  var marked = "tb-marked-tweet";
  var lastTweetId = null;

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
    lastTweetId = results.rows.item(0).tweetid;
    lastTweetId && decorateLastBookmark ();
  })

  // mark last read tweet
  function decorateLastBookmark() {
    $("."+marked).removeClass(marked);
    var elem = $('[data-tweet-id="'+lastTweetId+'"]');
    if (elem.length) {
      elem.addClass(marked);
      $('#tb-goto-bookmark a').html("Goto Bookmark (*)");
    }
  }

  // create bookmark element and handler for click
  $("#tb-bookmark").click(function(e){
    e.preventDefault();
    var currentTweet = $(".tweet").first();
    lastTweetId = currentTweet.attr("data-tweet-id");
    sql ("INSERT INTO bookmarks (tweetid) VALUES ("+lastTweetId+") ");
    decorateLastBookmark () ;
    return false;
  });

  $("#tb-goto-bookmark").click(function(e){
    e.preventDefault();
    var lastTweet = $("."+marked).first();
    if (lastTweet.length) {
      $.scrollTo(lastTweet.position().top, {duration: 300});
    }
    else {
      // it's dirty (
      alert('No bookmark found');
    }
    return false;
  });

  setInterval(decorateLastBookmark, 1000);

  // auto expand new tweets

  function liveFeedWithoutCounter() {
    $('.new-tweets-bar.js-new-tweets-bar').trigger('click');
  };

  setInterval(liveFeedWithoutCounter, 5000);

});

