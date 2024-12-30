const express = require('express');
const app = express();

// generate-league-routes.js

// Define a function to generate league routes
module.exports = function generateLeagueRoutes(app) {
    // Define a route to handle requests to "/league/:leagueName"
    app.get('/league/:leagueID', (req, res) => {
        // Extract the league name from the URL parameters
        const leagueID = req.params.leagueID;
        // Render the league page template using Handlebars
        res.render('pages/leagues-page', { leagueID: leagueID, user: user});
    });
};


