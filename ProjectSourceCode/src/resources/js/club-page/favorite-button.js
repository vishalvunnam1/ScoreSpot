document.addEventListener("DOMContentLoaded", function() {
    var favoriteButton = document.getElementById("club-favorite-button");
    if (favoriteButton) {
        favoriteButton.addEventListener("click", function() {
            var userID = document.getElementById("userID").value;
            var teamID = document.getElementById("teamID").value;
            var teamName = document.getElementById("teamName").value;
            var teamLogo = document.getElementById("teamLogo").value;
            
            if (favoriteButton.src.includes("/favorited.png")) {
                removeFavoriteTeam(userID, teamID);
            } else {
                addFavoriteTeam(userID, teamID, teamName, teamLogo);
            }
        });
    }
});

async function addFavoriteTeam(userID, teamID, teamName, teamLogo){
    try {
        const response = await fetch('/favteam/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                teamID: teamID,
                teamName: teamName,
                teamLogo: teamLogo
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add favorite team');
        }

        if (response.status === 200) {
            console.log('New favorite team added successfully.');
            var favoriteButton = document.getElementById("club-favorite-button");
            favoriteButton.src = "/img/club-page/favorited.png";
            location.reload(); // Refresh the page
        }

    } catch (error) {
        console.error('Error adding favorite team:', error);
    }
}

async function removeFavoriteTeam(userID, teamID) {
    try {
        const response = await fetch('/favteam/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                teamID: teamID
            })
        });
        
        if (response.status === 200) {
            console.log('Favorite team removed successfully.');
            var favoriteButton = document.getElementById("club-favorite-button");
            favoriteButton.src = "/img/club-page/unfavorited.png";
            location.reload(); // Refresh the page
        }

    } catch (error) {
        console.error('Error removing favorite team:', error);
    }
}
