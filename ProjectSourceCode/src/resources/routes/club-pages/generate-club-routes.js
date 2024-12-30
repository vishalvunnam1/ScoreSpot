const express = require('express');
const app = express();

// generate-league-routes.js

// Define a function to generate league routes
module.exports = function generateClubRoutes(app) {
    // Define a route to handle requests to "/league/:leagueName"
    app.get('/club/:clubID', (req, res) => {
        // Extract the league name from the URL parameters
        const clubID = req.params.clubID;
        // Render the league page template using Handlebars
        res.render('pages/club-page', { clubID: clubID, });
    });
};


