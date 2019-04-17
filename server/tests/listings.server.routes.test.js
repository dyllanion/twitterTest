var should = require('should'), 
    request = require('supertest'), 
    express = require('../config/app'), 
    Listing = require('../models/data');
    Users = require('../models/user');

/* Global variables */
var app, agent, listing, id;

/* Unit tests for testing server side routes for the listings API */
describe('Listings CRUD tests', function() {

  this.timeout(10000);

  before(function(done) {
    app = express.init();
    agent = request.agent(app);

    done();
  });

  it('Error when not all login fields are sent', function(done) {
    var account = {
      logemail: 'test@gmail.com', 
    };

    agent.post('/api/')
      .send(account)
      .expect('status', )
      .end(function(err, res) {
        res.status.should.equal(400);
        done();
      });
  });

  it('should be able to login', function(done) {
    var account = {
      logemail: 'test@gmail.com', 
      logpassword: 'password1', 
    };

    agent.post('/api/')
      .send(account)
      .expect(200)
      .end(function(err, res) {
        done();
      });
  });

  it('should it able to retrieve all users', function(done) {
    agent.get('/api/users')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body[0].email.should.equal('test@gmail.com')
        done();
      });
  });
  it('should be able to retrieve a single database', function(done) {
    agent.get('/api/data/trends_tampa/')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            should.exist(res);
            res.body[0].name.should.equal('#TheBachelor');
            // done();
          });
    agent.get('/api/data/trends_global/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body[0].name.should.equal('#PBBFirstB8ttle');
        // done();
      });
    agent.get('/api/data/trends_available/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        // done();
      });
    agent.get('/api/data/search_university/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        // done();
      });
    agent.get('/api/data/search_student/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        // done();
      });
    agent.get('/api/data/search_nasa/')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        done();
      });
  });
    
 

  it('should be able to logout', function(done) {
    agent.get('/api/logout')
      .send(listing)
      .expect(200)
        done();
      });
  });

  

  // it('should be able to login', function(done) {
  //   agent.post('/api/' + id)
  //     .expect(200)
  //     .end(function(err, res) {
  //       should.not.exist(err);
  //       should.exist(res);

  //       agent.get('/api/listings/' + id) 
  //         .expect(400)
  //         .end(function(err, res) {
  //           id = undefined;
  //           done();
  //         });
  //     })
  // });

  after(function(done) {
    // if(id) {
    //   Listing.remove({_id: id}, function(err){
    //     if(err) throw err;
    //     done();
    //   })
    // }
    // else {
        done();
    // }
  });
// });
