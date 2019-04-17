var should = require('should'), 
    mongoose = require('mongoose'), 
    data = require('../models/data'), 
    config = require('../config/password');
    User = require('../models/user');

var account, id;

account =  {
  email: "mocha@gmail.com",
  username: "mochaUnit",
  password: "password123",
};
  

describe('Listing Schema Unit Tests', function() {

  before(function(done) {
    mongoose.connect(config.db);
    done();
  });

  describe('Saving User database', function() {
    /*
      Mocha's default timeout for tests is 2000ms. To ensure that the tests do not fail 
      prematurely, we can increase the timeout setting with the method this.timeout()
     */
    this.timeout(10000);

    it('saves user properly', function(done){
      new User(account).save(function(err, userNew){
        should.not.exist(err);
        done();
      });
    });

  // it('Deletes User When done', function(done){
  //   User.remove({ email: account.email }).exec(function() {
  //     done();
  //   });
  // });

    it('Deletes User When done', function(done){
      User.remove({ email: account.email }).exec(function() {
        done();
      });
    });

    // it('saves properly when all three properties provided', function(done){
    //   new Listing(listing).save(function(err, listing){
    //     should.not.exist(err);
    //     id = listing._id;
    //     done();
    //   });
    // });

    // it('throws an error when name not provided', function(done){
    //   new Listing({
    //     code: listing.code
    //   }).save(function(err){
    //     should.exist(err);
    //     done();
    //   })
    // });

    // it('throws an error when code not provided', function(done){
    //   new Listing({
    //     name: listing.name
    //   }).save(function(err){
    //     should.exist(err);
    //     done();
    //   })
    // });

  });

  afterEach(function(done) {
    done();
    // if(id) {
    //   Listing.remove({ _id: id }).exec(function() {
    //     id = null;
    //     done();
    //   });
    // } else {
    //   done();
    // }
  });
});