function redirectToLeaguePage(leagueID) {
  // Append the league name to the URL
  var url = "/league/" + leagueID;
  
  // Redirect to the league page
  window.location.href = url;
}