// navbar-sticky.js

// Function to add sticky behavior to the navbar
function makeNavbarSticky() {
  // Get the navigation bar element
  var navbar = document.getElementById("navigation-bar-container");
  var accountPane = document.querySelector(".account-portal-container"); // Use querySelector instead of getElementByClassName

  // Get the initial offset of the navbar from the top of the page
  var navbarOffset = navbar.offsetTop;

  // Function to add sticky behavior when scrolling
  function stickyNavbar() {
    // Check if the current scroll position is greater than or equal to the initial offset of the navbar
    if (window.pageYOffset >= navbarOffset) {
      // Add the 'fixed-top' class to make the navbar sticky
      navbar.classList.add("fixed-top");
      // Add padding to the body to prevent content from jumping when the navbar becomes sticky
      document.body.style.paddingTop = navbar.offsetHeight + "px";
      
      // Adjust the position of the account pane
      accountPane.style.position = "fixed"; // Make the account pane fixed
      accountPane.style.top = navbar.offsetHeight + 20 + 'px'; // Move the account pane below the navbar
    } else {
      // Remove the 'fixed-top' class to make the navbar non-sticky
      navbar.classList.remove("fixed-top");
      // Reset the padding of the body
      document.body.style.paddingTop = 0;
      accountPane.style.position = "absolute"; // Make the account pane fixed
      
      // Set the top position of the account pane to be 150px off the top
      accountPane.style.top = "160px";
    }
  }

  // Call the stickyNavbar function when the page is scrolled
  window.onscroll = function() {
    stickyNavbar();
  };
}

// Call the makeNavbarSticky function when the page loads
window.onload = function() {
  makeNavbarSticky();
};
