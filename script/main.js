import { teams } from "../data/teams.js";
import { getMatchData } from "./match-data.js";

const teamTableBody = document.getElementById("js-team-table-body");
const tableYear = document.getElementById(" js-table-year")

async function fetchTeams(year) {
    const response = await fetch(`https://api.openligadb.de/getavailableteams/bl1/${year}`);
    const data = await response.json();
    
    teamTableBody.innerHTML = "";

    

    data.forEach((team, index) => { 
    const matchingTeam = teams.find(item => item.teamId === team.teamId);

    const row = document.createElement("tr");
    row.classList.add("main-team-row"); 

    const standingCell = document.createElement("td");
    standingCell.classList.add("standing");
    standingCell.textContent = index + 1; 
    row.appendChild(standingCell);

   
    const teamCell = document.createElement("td");
    teamCell.classList.add("team-info"); 
    
    const teamImageContainer = document.createElement("div");
    teamImageContainer.classList.add("main-team-image-container");
    const teamImage = document.createElement("img");
    teamImage.src = matchingTeam.teamIconUrl;
    teamImage.alt = matchingTeam.teamName + " logo"; 
    teamImageContainer.appendChild(teamImage);
    
    const teamNameHeading = document.createElement("h3");
    teamNameHeading.textContent = matchingTeam.teamName;

    teamCell.appendChild(teamImageContainer);
    teamCell.appendChild(teamNameHeading);
    row.appendChild(teamCell);

   
    const stats = ["0", "0", "0", "0", "0", "0", "0", "0"]; 
    const classes = ["games-played", "games-won", "games-draw", "games-lost", "goals-scored", "goals-received", "goal-difference", "points"];

    stats.forEach((stat, i) => {
      const statCell = document.createElement("td");
      statCell.classList.add(classes[i]);
      statCell.textContent = stat;
      row.appendChild(statCell);
    });
    
    teamTableBody.appendChild(row);
     });
}
fetchTeams(2025);
getMatchData(2018,1);