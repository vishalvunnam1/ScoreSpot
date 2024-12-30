document.addEventListener("DOMContentLoaded", function() {
    var goalDifferenceCells = document.querySelectorAll("#league-table-goal-difference-column"); // Selecting the cells in the goal_difference column

    goalDifferenceCells.forEach(function(cell) {
        var goalDifference = parseInt(cell.textContent);
        var color;

        if (goalDifference < 0) 
        {
            // Gradually darken the text color for negative goal differences
            var darkenFactor = Math.ceil(goalDifference / -10); // Calculate the darken factor
            var shade = Math.max(0, 255 - darkenFactor * 25); // Calculate the shade of red
            color = "rgb(" + shade + ", 0, 0)"; // Create the color value
        } 
        else if (goalDifference > 0) 
        {
            // Gradually darken the text color for positive goal differences
            var darkenFactor = Math.floor(goalDifference / 10); // Calculate the darken factor
            var shade = Math.max(0, 155 - darkenFactor * 15); // Adjusted the starting point to make greens darker
            color = "rgb(0, " + shade + ", 0)"; // Create the color value
        } 
        else 
        {
            color = "inherit"; // If goal difference is 0, leave text color unchanged
        }

        cell.style.color = color; // Apply the calculated color
    });
});
