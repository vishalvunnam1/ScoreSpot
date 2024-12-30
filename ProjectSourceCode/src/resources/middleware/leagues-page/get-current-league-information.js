const axios = require('axios');

// Middleware function to fetch leagues data
const fetchLeaguesData = async (req, res, next) => {
    try {
        // Extract league ID from the URL
        const leagueID = req.params.leagueID;

        // Make GET request to the API endpoint using the league ID
        const response = await axios.get(`http://api.football-data.org/v4/competitions/${leagueID}/standings?season`, {
            headers: {
                'X-Auth-Token': '0aa1ed31245d4a36b1ef5a79150324b3', // Add your API key here
            },
        });

        // Extract relevant data from the API response
        const leagueData = response.data;

        // Attach the data to res.locals
        //res.locals.username = req.session.user.username;
        console.log(req.session.user)
        res.locals.league = {
            area: {
                league_flag: leagueData.area.flag,
            },
            competition: {
                league_id: leagueData.competition.id,
                league_name: leagueData.competition.name,
                league_emblem: leagueData.competition.emblem
            },
            standings: leagueData.standings[0].table.map(team => ({
                table: {
                    league_position: team.position,
                    team_id: team.team.id,
                    team_name: team.team.name,
                    team_crest: team.team.crest
                },
                games_played: team.playedGames,
                wins: team.won,
                losses: team.lost,
                draws: team.draw,
                goal_difference: team.goalDifference,
                points: team.points
            })),
        };
        next();
    } catch (error) {
        console.error('Error fetching leagues data:', error);
        res.locals.league = null; // Set to null if there's an error
        next(); // Call next middleware or route handler
    }
};

module.exports = fetchLeaguesData;
