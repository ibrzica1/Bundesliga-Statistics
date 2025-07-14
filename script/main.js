import { teams } from "../data/teams.js";
import { getMatchData, playSeason, stageSeason} from "./match-data.js";
import { select, playYear, stopYear,selectYear, previousYear, nextYear, normalSpeed, doubleSpeed,tripleSpeed } from "./buttons.js";

const teamTableBody = document.getElementById("js-team-table-body");

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

