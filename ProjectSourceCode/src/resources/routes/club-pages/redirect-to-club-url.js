// Add click event listener to club logos
document.querySelectorAll('#league-table-club-logo, #league-table-club-name-column, #league-top-scorers-logo, #league-top-scorers-club-name-column').forEach(element => {
  element.addEventListener('click', (event) => {
      // Get the club ID from the clicked club logo's clubID attribute
      const clubId = element.getAttribute('clubID');
      redirectToClubPage(clubId);
  });
});

// Function to redirect to the club page
function redirectToClubPage(clubID) {
  // Append the club ID to the URL
  var url = "/club/" + clubID;

  // Redirect to the club page
  window.location.href = url;
}
