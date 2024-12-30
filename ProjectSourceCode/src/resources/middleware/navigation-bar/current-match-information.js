const moment = require('moment');
const axios = require('axios');

// Middleware function to fetch matches data
const fetchMatchesData = async (req, res, next) => {
    try {
        const today = moment().format('YYYY-MM-DD'); // Get today's date in YYYY-MM-DD format

        // Subtract one day to get yesterday's date
        const yesterdayUnformatted = moment().subtract(1, 'days');

        // Format yesterday's date as YYYY-MM-DD
        const yesterday = yesterdayUnformatted.format('YYYY-MM-DD');

        // Array of years to fetch matches data
        const league_ids = [2021, 2002, 2014, 2019, 2015, 2013];

        // Array to store all matches data
        let allMatches = [];

        // Loop through each year and fetch matches data
        for (const league_id of league_ids) {
            const response = await axios({
                url: `http://api.football-data.org/v4/competitions/${league_id}/matches`,
                method: 'GET',
                params: {
                    dateFrom: yesterday, // Set dateFrom to yesterday's date
                    dateTo: today, // Set dateTo to today's date
                },
                headers: {
                    'X-Auth-Token': '0aa1ed31245d4a36b1ef5a79150324b3', // Add your API key here
                },
            });

            // Extract relevant data from the API response
            const matches = response.data.matches.map(match => ({
                homeTeam: {
                    teamID: match.homeTeam.id,
                    name: match.homeTeam.tla,
                    crest: match.homeTeam.crest,
                },
                awayTeam: {
                    teamID: match.awayTeam.id,
                    name: match.awayTeam.tla,
                    crest: match.awayTeam.crest,
                },
                score: {
                    homeScore: match.score.fullTime.home,
                    awayScore: match.score.fullTime.away,
                },
                minute: match.status, // Set the minute of the game
            }));

            // Concatenate matches data to allMatches array
            allMatches = allMatches.concat(matches);
        }

        // Attach all matches data to res.locals
        res.locals.matches = allMatches;
        next();
    } catch (error) {
        console.error('Error fetching matches data:', error);
        res.locals.matches = []; // Set an empty array if there's an error
        next(); // Call next middleware or route handler
    }
};

module.exports = fetchMatchesData;
