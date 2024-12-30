CREATE TABLE users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password CHAR(60) NOT NULL
);

CREATE TABLE FavoriteTeams (
    TeamID INT,
    UserID INT REFERENCES users(UserID),
    TeamName VARCHAR(50),
    TeamLogo VARCHAR(100)
);
