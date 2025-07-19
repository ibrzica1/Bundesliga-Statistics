import { teams } from "../data/teams.js";
import { getMatchData, playSeason, stageSeason} from "./match-data.js";
import { select, playYear, stopYear,selectYear, previousYear, nextYear, normalSpeed, doubleSpeed,tripleSpeed } from "./buttons.js";
import { moveBar } from "./matches.js";

const teamTableBody = document.getElementById("js-team-table-body");
const matchesGrid = document.getElementById("js-matches-grid");

export const tableContainer = document.querySelector(".standings-table-container");
const play = document.getElementById("js-play-btn");
const stop = document.getElementById("js-stop-btn");
const previous = document.getElementById("js-previous-btn");
const next = document.getElementById("js-next-button");
const speed1x = document.getElementById("js-speed1x");
const speed2x = document.getElementById("js-speed2x");
const speed3x = document.getElementById("js-speed3x");


selectYear.addEventListener("change",()=>{
  select();
})
play.addEventListener("click",()=>{
  playYear();
})
stop.addEventListener("click",()=>{
  stopYear();
})
previous.addEventListener("click",()=>{
  previousYear();
})
next.addEventListener("click",()=>{
  nextYear();
})
speed1x.addEventListener("click",()=>{
  normalSpeed();
})
speed2x.addEventListener("click",()=>{
  doubleSpeed();
})
speed3x.addEventListener("click",()=>{
  tripleSpeed();
})

export function displayTeams(array) {
    
    teamTableBody.innerHTML = "";

    array.forEach((team, index) => { 
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

    const stats = [team.gamesPlayed, team.win, team.draw, team.lost, team.scored, team.recived, team.scored - team.recived, team.points]; 
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

export function displayMatches(array){
  const sortedArray = Object.values(array.reduce((acc, obj) => {
    acc[obj.matchData.matchId] = obj;
    return acc;
  },{}));
  let matchesHtml = "";

  sortedArray.forEach(match => {
    const matchingTeam1 = teams.find(team => team.teamId === match.matchData.team1);
    const matchingTeam2 = teams.find(team => team.teamId === match.matchData.team2);

    const matchId = match.matchData.matchId;

    matchesHtml += `
      <div class="wrapper">
        <div class="match-container">
          <div class="team1">
            <img src="${matchingTeam1.teamIconUrl}" alt="${matchingTeam1.teamName} logo">
            <p class="team-name">${matchingTeam1.teamName}</p>
            <h2 id="js-score-team1-${matchId}">${match.matchData.score.scoreTeam1}</h2>
          </div>
          <p>VS</p>
          <div class="team2">
            <h2 id="js-score-team2-${matchId}">${match.matchData.score.scoreTeam2}</h2>
            <p class="team-name">${matchingTeam2.teamName}</p>
            <img src="${matchingTeam2.teamIconUrl}" alt="${matchingTeam2.teamName} logo">
          </div>
        </div>
        <div class="replay-container">
          <div class="progress-field">
            <div class="progress-bar" id="js-progress-bar${matchId}"></div>
          </div>
          <button id="js-match-play-btn${matchId}">
            <img src="images/player-icons/play-button-arrowhead.png" alt="Play button">
          </button>
        </div>
        <div class="scorrerGrid" 
          id="js-scorrerGrid-${matchId}">
          <div class="scorrerContainer">
            <div class="scorrerTeam1"></div>
            <div class="scorrerTeam2"></div>
          </div> 
        </div>
      </div>
    `;
  });

  matchesGrid.innerHTML = matchesHtml;
  
  sortedArray.forEach(match => {
    const matchId = match.matchData.matchId;
    const playBtn = document.getElementById(`js-match-play-btn${matchId}`);
    const goals = match.matchData.goals.map(data => ({
      goalID: data.goalID,
      matchMinute: data.matchMinute,
      scoreTeam1: data.scoreTeam1,
      scoreTeam2: data.scoreTeam2,
      goalGetterID: data.goalGetterID,
      goalGetterName: data.goalGetterName
    })).sort((a,b) => a.matchMinute - b.matchMinute);
    
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        moveBar(matchId,goals);
      });
    }
  });
}


