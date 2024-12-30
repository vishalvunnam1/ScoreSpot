$(document).ready(function() {

  // When #user is clicked
  $('#user-profile-button').click(function() {

    $('#register-screen-container').hide();
    // Toggle the visibility of the login container
    $('#login-pane').toggle();
  });

  $('#register-page-login-button').click(function (event) {
    event.preventDefault(); // Prevent the default action of following the link

    $('#register-screen-container').hide();
    $('#login-pane').show();
  });

});

$(document).ready(function () {
  
  // Listen for click event on the register button
  $('#register-button').click(function (event) {
    event.preventDefault(); // Prevent the default action of following the link

    $('#login-pane').hide();
    // Show the register container
    $('#register-screen-container').show();
  });
    
});

$(document).ready(function() {

  // When #user is clicked
  $('#user-profile-button').click(function() {

    // Toggle the visibility of the login container
    $('#account-pane').toggle();
  });
});