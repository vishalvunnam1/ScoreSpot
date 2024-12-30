// Convert finished matches to "FT"
const convert_time = (req, res, next) => {
    try {
        // Access matches data from res.locals
        const matches = res.locals.matches;

        // Loop through matches and convert "FINISHED" to "FT" for minute
        const convertedMatches = matches.map(match => {
            if (match.minute === "FINISHED") {
                match.minute = "FT";
            }
            else if (match.minute === "IN_PLAY") {
                match.minute = "IP"
            }
            else if (match.minute === "TIMED") {
                match.minute = "TM";
            }
            return match;
        });

        // Update res.locals with converted matches
        res.locals.matches = convertedMatches;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        // If an error occurs, log it and proceed to the next middleware/route handler
        console.error('Error converting finished matches:', error);
        next();
    }
};

module.exports = convert_time;
