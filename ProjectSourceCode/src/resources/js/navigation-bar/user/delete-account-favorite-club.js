document.addEventListener("DOMContentLoaded", function() {
    var deleteButtons = document.querySelectorAll("#account-delete-favorite-team-button-hover");
    deleteButtons.forEach(function(deleteButton) {
        deleteButton.addEventListener("click", function() {
            var userID = deleteButton.getAttribute("userID");
            var teamID = deleteButton.getAttribute("teamID");
            
            if (deleteButton.src.includes("/delete-club-hover.png")) {
                removeAccountFavoriteTeam(userID, teamID);
            }
        });
    });
});

async function removeAccountFavoriteTeam(userID, teamID) {
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
            location.reload(); // Refresh the page
        }

    } catch (error) {
        console.error('Error removing favorite team:', error);
    }
}
