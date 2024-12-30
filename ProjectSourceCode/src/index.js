// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const moment = require('moment'); // To extract current time data

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(async function(req, res, next) {
  res.locals.user = req.session.user; 

  if(res.locals.user) {
    try {
      res.locals.fav_teams = await getFavoriteTeamsForUser(res.locals.user.userid);
    } catch (error) {
      console.error('Error fetching favorite teams:', error);
    }
  }

  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'resources')));

// *****************************************************
// <!-- Section 4 : Middleware -->
// *****************************************************

// Middleware to automatically update live scoreboard
const fetchMatchesData = require('./resources/middleware/navigation-bar/current-match-information');
app.use(fetchMatchesData);

//Middleware to automatically update in-game time abbreviations

const convert_time = require('./resources/middleware/navigation-bar/convert-time');
app.use(convert_time);


// Leagues Page Middleware

const fetchLeaguesData = require('./resources/middleware/leagues-page/get-current-league-information');
const fetchLeagueScorerData = require('./resources/middleware/leagues-page/get-current-league-top-scorers');

app.get('/league/:leagueID', [fetchLeaguesData, fetchLeagueScorerData], (req, res) => {
    // Render the Handlebars view with league data
    res.render('pages/leagues-page', {
        leagueID: req.params.leagueID,
        leagues: res.locals.leagues,
        scorers: res.locals.topScorers // Assuming fetchLeagueScorerData sets the data in res.locals.scorers
    });
});

// Clubs Page Middleware

const fetchClubsData = require('./resources/middleware/clubs-page/get-current-club-information');

app.get('/club/:clubID', [fetchClubsData], (req, res) => {
    // Render the Handlebars view with league data

      var isFav = false;
      var fav_teams = res.locals.fav_teams;
      if(res.locals.user && fav_teams)
      {
      const isTeamIDInFavTeams = fav_teams.some(team => {
        const teamIdInt = parseInt(team.teamid);
        const clubIdInt = parseInt(req.params.clubID);
        console.log('Checking team:', teamIdInt);
        console.log('equal to', clubIdInt);
        return teamIdInt === clubIdInt;
    });
      if (isTeamIDInFavTeams) {
        isFav = true
      } 
      }
    res.render('pages/clubs-page', {
        isFav: isFav,
        clubID: req.params.clubID,
        clubs: res.locals.club
    });
});

// *****************************************************
// <!-- Section 5 : API Routes -->
// *****************************************************

/************************ 
 Login Page Routes
*************************/

// Redirect to the /login endpoint
app.get('/', (req, res) => {
    res.redirect('/home');
});
  
// Render login page for /login route
app.get('/login', (req, res) => {
    res.render('/');
});
  
// Trigger login form to check database for matching username and password
app.post('/login', async (req, res) => {
    try {
        // Check if username exists in DB
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', req.body.username);
  
        if (!user) {
            // Redirect user to login screen if no user is found with the provided username
            return res.redirect('/register');
        }
  
        // Check if password from request matches with password in DB
        const match = await bcrypt.compare(req.body.password, user.password);
  
        // Check if match returns no data
        if (!match) {
            // Render the login page with the message parameter
            return res.render('/', { message: 'Password does not match' });
        }
        else{
        // Save user information in the session variable
        req.session.user = user;
        req.session.save();
  
        // Redirect user to the home page
        res.redirect('/');
        }
    } catch (error) {
        // Direct user to login screen if no user is found with matching password
        res.redirect('/register');
    }
});
  
/************************ 
 Registration Page Routes
*************************/
  
// Render registration page for /register route
app.get('/register', (req, res) => {
    res.redirect('/');
});

// Trigger Registration Form to Post
app.post('/register', async (req, res) => {
  try {
      if (!req.body.username || !req.body.password) {
          // If username or password is missing, respond with status 400 and an error message
          return res.status(400).json({ status: 'error', message: 'Invalid input' });
      }

      // Check if the username already exists in the database
      const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', req.body.username);
      if (existingUser) {
          // If a user with the same username already exists, respond with status 409 and an error message
          return res.status(409).json({ status: 'error', message: 'Username already exists' });
      }

      // Hash the password using bcrypt library
      const hash = await bcrypt.hash(req.body.password, 10);

      // Insert username and hashed password into the 'users' table
      await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [req.body.username, hash]);
      const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', req.body.username);
      req.session.user = user;
      req.session.save();
      // Redirect user to the home page
      res.redirect('/home');
  } catch (error) {
      // If an error occurs during registration, respond with status 500 and an error message
      res.status(500).json({ status: 'error', message: 'An error occurred during registration' });
  }
});

/************************ 
 Home Page Routes
*************************/

app.get('/home', (req, res) => {
  const loggedIn = req.session.user ? true : false;
   res.render('pages/home');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Internal Server Error');
      } else {
          // Redirect to the same page after destroying the session
          res.redirect('/'); // You can change '/' to the desired page if it's not the home page
      }
  });
});

/************************ 
 League Page Routes
*************************/

// Import and call generateLeagueRoutes function
const generateLeagueRoutes = require('./resources/routes/league-pages/generate-league-routes');
generateLeagueRoutes(app);

/************************ 
 Club Page Routes
*************************/

// Import and call generateLeagueRoutes function
const generateClubRoutes = require('./resources/routes/club-pages/generate-club-routes');
generateClubRoutes(app);

/************************ 
 Favorite Team Database
*************************/

// Function to add a new row to the FavoriteTeams table
// database configuration

app.post('/favteam/add', async (req, res, next) => {
  try {
      const { userID, teamID, teamName, teamLogo } = req.body;

      // Check if the user is logged in
      if (!req.session.user) {
          return res.status(400).json({ message: 'Login or register to add a favorite team.' });
      }

      // Insert the new favorite team into the database
      const query = {
          text: 'INSERT INTO FavoriteTeams (UserID, TeamID, TeamName, TeamLogo) VALUES ($1, $2, $3, $4)',
          values: [userID, teamID, teamName, teamLogo],
      };

      await db.none(query);
      console.log('New favorite team added successfully.');
      return res.status(200).json({ message: 'New favorite team added successfully.' });
  } catch (error) {
      console.error('Error adding favorite team:', error);
      return res.status(500).json({ error: 'Error adding favorite team' });
  }
});

app.post('/favteam/remove', async (req, res) => {
  try {
    const { userID, teamID } = req.body;

    // Check if the team exists for the user
    const existingTeam = await db.oneOrNone(
      'SELECT * FROM FavoriteTeams WHERE UserID = $1 AND TeamID = $2',
      [userID, teamID]
    );

    // If the team does not exist for the user, return a 404 error
    if (!existingTeam) {
      return res.status(404).json({ message: 'This team is not in your favorites.' });
    }

    // Remove the favorite team from the database
    await db.none(
      'DELETE FROM FavoriteTeams WHERE UserID = $1 AND TeamID = $2',
      [userID, teamID]
    );

    console.log('Favorite team removed successfully.');
    return res.status(200).json({ message: 'Favorite team removed successfully.' });
  } catch (error) {
    console.error('Error removing favorite team:', error);
    
    // If the error is a database error, return a 500 error
    if (error instanceof QueryResultError) {
      return res.status(500).json({ error: 'Database error occurred while removing favorite team' });
    }
    
    // If the error is a generic error, return a 400 error
    return res.status(400).json({ error: 'Error occurred while removing favorite team' });
  }
});

async function getFavoriteTeamsForUser(userId) {
  try {
    // Execute the SQL query
    const favoriteTeams = await db.any(`
      SELECT * FROM FavoriteTeams
      WHERE UserID = $1;
    `, userId);`a`
    
    // Return the result
    return favoriteTeams;
  } catch (error) {
    console.error('Error fetching favorite teams:', error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');