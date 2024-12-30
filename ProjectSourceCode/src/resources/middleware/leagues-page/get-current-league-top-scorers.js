const axios = require('axios');

// Middleware function to fetch leagues data
const fetchLeagueScorerData = async (req, res, next) => {
    try {
        // Extract league ID from the URL
        const leagueID = req.params.leagueID;

        // Make GET request to the API endpoint using the league ID
        const response = await axios.get(`http://api.football-data.org/v4/competitions/${leagueID}/scorers?season&limit=20`, {
            headers: {
                'X-Auth-Token': '0aa1ed31245d4a36b1ef5a79150324b3', // Add your API key here
            },
        });

        // Extract relevant data from the API response
        const scorerData = response.data;

        // Attach the data to res.locals
        res.locals.topScorers = {
            scorers: scorerData.scorers.map(player => ({
                player: {
                    player_id: player.player.id,
                    player_name: player.player.name,
                },
                team: {
                    team_id: player.team.id,
                    team_name: player.team.name,
                    team_crest: player.team.crest,
                },
                games_played: player.playedMatches,
                goals: player.goals,
            }))
        };

        next();
    } catch (error) {
        console.error('Error fetching leagues data:', error);
        res.locals.topScorers = null; // Set to null if there's an error
        next(); // Call next middleware or route handler
    }
};

module.exports = fetchLeagueScorerData;
