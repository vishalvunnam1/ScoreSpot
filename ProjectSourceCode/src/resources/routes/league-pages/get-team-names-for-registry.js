const axios = require('axios');

const fetchTeamNames = async (selectedLeague) => {
    try {
        const response = await axios({
            url: `http://api.football-data.org/v4/competitions/${selectedLeague}/teams`,
            method: 'GET',
            headers: {
                'X-Auth-Token': '0aa1ed31245d4a36b1ef5a79150324b3',
            },
        });
        
        const teams = response.data.teams.map(team => team.name);
        return teams;
    } catch (error) {
        console.error('Error fetching teams data:', error);
        return [];
    }
};

module.exports = fetchTeamNames;
