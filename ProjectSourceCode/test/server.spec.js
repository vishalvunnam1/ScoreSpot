
// ********************** Initialize server **********************************

const server = require('../src/index.js'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************

  describe('Testing Add User API', () => {
    it('positive: /register', done => {
      // Define mock user data
      const userData = {
        username: 'Test User',
        password: '123456'
      };
      // Make a POST request to /register with mock user data
      chai.request(server)
        .post('/register')
        .send(userData)
        .end((err, res) => {
          // Assertions
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  //We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 400 along with a "Invalid input" message.

  describe('Testing Add User API', () => {
    it('Negative: /register. Checking invalid name', done => {
      chai.request(server)
        .post('/register')
        .send({ Username: 10, Password: '2020-02-20'})
        .end((err, res) => {
          // Assertions
          expect(res).to.have.status(400);
          expect(res.body.message).to.equals('Invalid input');
          done();
        });
    });
  });

  describe('Testing Render', () => {
    // Sample test case given to test /test endpoint.
    it('test "/login" route should render with an html response', done => {
      chai
        .request(server)
        .get('/login') // for reference, see lab 8's login route (/login) which renders home.hbs
        .end((err, res) => {
          res.should.have.status(200); // Expecting a success status code
          res.should.be.html; // Expecting a HTML response
          done();
        });
    });
  });
  var cookies;

  describe('Login', () => {
    // Sample test case given to test /login endpoint.
    it('Returns the default welcome message', done => {
      chai
        .request(server)
        .get('/login')
        .end((err, res) => {
          if (res.headers['set-cookie']) {
            // Save the cookies
            cookies = res.headers['set-cookie'].pop().split(';')[0];
          } else {
            cookies = null;
          }
          done();
        });
    });
  });
  describe('Home', () => {
    // Sample test case given to test /login endpoint.
    it('Returns the default welcome message', done => {
      chai
        .request(server)
        .get('/home')
        .end((err, res) => {
          if (res.headers['set-cookie']) {
            // Save the cookies
            cookies = res.headers['set-cookie'].pop().split(';')[0];
          } else {
            cookies = null;
          }
          done();
        });
    });
  });
