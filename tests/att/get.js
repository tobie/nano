var vows     = require('vows')
  , assert   = require('assert')
  , async    = require('async')
  , cfg      = require('../../cfg/tests.js')
  , nano     = require('../../nano')(cfg)
  , pixel    = "Qk06AAAAAAAAADYAAAAoAAAAAQAAAP////8BABgAAAAAAAAAAAATCwAAEwsAAAAAAAAAAAAAWm2CAA==";

function db_name(i) { return "att_ge" + i; }
function db(i) { return nano.use(db_name(i)); }

/*****************************************************************************
 * att_get                                                                   *
 *****************************************************************************/
function att_get(callback) {
  var buffer = new Buffer(pixel, 'base64');
  nano.db.create(db_name("a"), function () {
    db("a").attachment.insert("new", "att", "Hello", "text/plain",
      function(_,_,b) {
        db("a").attachment.insert("new", "att", buffer, "image/bmp", {rev: b.rev},
          function (e,_,b) {
          if(e) { callback(e); }
          db("a").attachment.get("new", "att", {rev: b.rev}, callback);
        });
    });
  });
}

function att_get_ok(e,h,b) {
  nano.db.destroy(db_name("a"));
  var buffer = new Buffer(b, "binary");
  assert.isNull(e);
  assert.equal(buffer.toString('base64'), pixel);
}

vows.describe('attachment.get').addBatch({
  "att_get": {
    topic: function () { att_get(this.callback); }
  , "=": att_get_ok }
}).exportTo(module);