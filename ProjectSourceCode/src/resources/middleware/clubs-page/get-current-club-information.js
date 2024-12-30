const axios = require('axios');

// Middleware function to fetch clubs data
const fetchClubsData = async (req, res, next) => {
    try {
        // Extract club ID from the URL
        const clubID = req.params.clubID;

        // Make GET request to the API endpoint using the club ID
        const response = await axios.get(`http://api.football-data.org/v4/teams/${clubID}/?offset=&limit=`, {
            headers: {
                'X-Auth-Token': '0aa1ed31245d4a36b1ef5a79150324b3', // Add your API key here
            },
        });

        // Extract relevant data from the API response
        const clubData = response.data;
        // res.locals.user = users
        // Attach the data to res.locals
        res.locals.club = {
            area: {
                id: clubData.area.id,
                name: clubData.area.name,
                code: clubData.area.code,
                club_flag: clubData.area.flag,
            },
            club_id: clubData.id,
            name: clubData.name,
            shortName: clubData.shortName,
            tla: clubData.tla,
            crest: clubData.crest,
            address: clubData.address,
            website: clubData.website,
            founded: clubData.founded,
            clubColors: clubData.clubColors,
            venue: clubData.venue,
            runningCompetitions: clubData.runningCompetitions.map(competition => ({
                id: competition.id,
                name: competition.name,
                code: competition.code,
                type: competition.type,
                emblem: competition.emblem
            })),
            coach: {
                id: clubData.coach.id,
                firstName: clubData.coach.firstName,
                lastName: clubData.coach.lastName,
                name: clubData.coach.name,
                dateOfBirth: clubData.coach.dateOfBirth,
                nationality: clubData.coach.nationality,
                contract: {
                    start: clubData.coach.contract.start,
                    until: clubData.coach.contract.until
                }
            },
            squad: clubData.squad.map(player => ({
                id: player.id,
                name: player.name,
                position: player.position,
                dateOfBirth: player.dateOfBirth,
                nationality: player.nationality
            })),
            staff: clubData.staff,
            lastUpdated: clubData.lastUpdated
        };
        next();
    } catch (error) {
        console.error('Error fetching clubs data:', error);
        res.locals.club = null; // Set to null if there's an error
        next(); // Call next middleware or route handler
    }
};

module.exports = fetchClubsData;
