import { teams } from "../data/teams.js";

const teamGrid = document.getElementById("js-team-grid");

async function fetchTeams(year) {
    const response = await fetch(`https://api.openligadb.de/getavailableteams/bl1/${year}`);
    const data = await response.json();
    
    teamGrid.innerHTML = "";

    data.forEach(team => {
      const matchingTeam = teams.find(item => item.teamId === team.teamId)
      teamGrid.innerHTML += `
      <div class="main-team-container">
        <div class="main-team-image-container">
          <img src="${matchingTeam.teamIconUrl}">
        </div>
        <h2>${matchingTeam.teamName}</h2>
      </div>
      `;
    })
}
fetchTeams(2025)
