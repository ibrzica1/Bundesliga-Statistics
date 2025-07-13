import { teams } from "../data/teams.js";
import { displayTeams, selectYear, tableContainer } from "./main.js";


export let seasonStats = {};
export let isPaused = false;
export let intervalId = null;
let currentMatchDay = 1;
const playImage = document.querySelector(".play-btn-img");
const playerContainer = document.querySelector(".player-wrapper");


export async function playSeason(year) {
  if(intervalId) return;

  intervalId = setInterval(async ()=> {
    if(isPaused || currentMatchDay > 34) {
      clearInterval(intervalId);
      intervalId = null;
      return;
    }

   let teamStats = await getMatchData(year,currentMatchDay);

   teamStats.forEach(team => {
    const teamId = team.teamId;

    if (seasonStats[teamId]) {
      seasonStats[teamId].gamesPlayed += team.gamesPlayed;
      seasonStats[teamId].win += team.win;
      seasonStats[teamId].draw += team.draw;
      seasonStats[teamId].lost += team.lost;
      seasonStats[teamId].scored += team.scored;
      seasonStats[teamId].recived += team.recived;
      seasonStats[teamId].points += team.points;
    } else {
      seasonStats[teamId] = {
        teamId: team.teamId,
        gamesPlayed: team.gamesPlayed,
        win: team.win,
        draw: team.draw,
        lost: team.lost,
        scored: team.scored,
        recived: team.recived,
        points: team.points
      };
    }}
  );
  let sortedSeason = Object.values(seasonStats).sort((a,b) => b.points - a.points);
  displayTeams(sortedSeason);
  currentMatchDay++;

  },2000) 
}

export async function getMatchData(year,matchDay) {
      const response = await fetch(`https://api.openligadb.de/getmatchdata/bl1/${year}/${matchDay}`);
      const data = await response.json();

      let teamStats = {};

      data.forEach(match => {
        const matchingTeam1 = teams.find(team => team.teamId === match.team1.teamId);
        const matchingTeam2 = teams.find(team => team.teamId === match.team2.teamId);

        const id1 = matchingTeam1.teamId;
        const id2 = matchingTeam2.teamId;
        const goals1 = match.matchResults[1].pointsTeam1;
        const goals2 = match.matchResults[1].pointsTeam2;
        let gamesplayed;
        let winTeam1;
        let winTeam2;
        let lostTeam1;
        let lostTeam2;
        let draw;
        let pointsTeam1;
        let pointsTeam2;
        
          if(goals1 > goals2) {
            gamesplayed = 1;
            winTeam1 = 1;
            winTeam2 = 0;
            lostTeam1 = 0;
            lostTeam2 = 1;
            draw = 0;
            pointsTeam1 = 3;
            pointsTeam2 = 0;  }
          else if(goals1 < goals2) {
            gamesplayed = 1;
            winTeam1 = 0;
            winTeam2 = 1;
            lostTeam1 = 1;
            lostTeam2 = 0;
            draw = 0;
            pointsTeam1 = 0;
            pointsTeam2 = 3;  }
          else if(goals1 === goals2) {
            gamesplayed = 1;
            winTeam1 = 0;
            winTeam2 = 0;
            lostTeam1 = 0;
            lostTeam2 = 0;
            draw = 1;
            pointsTeam1 = 1;
            pointsTeam2 = 1;  }
           
        teamStats[id1] = {
          teamId: id1,
          gamesPlayed: gamesplayed,
          win: winTeam1,
          draw: draw,
          lost: lostTeam1,
          scored: goals1,
          recived: goals2,
          points: pointsTeam1
        }
        teamStats[id2] = {
          teamId: id2,
          gamesPlayed: gamesplayed,
          win: winTeam2,
          draw: draw,
          lost: lostTeam2,
          scored: goals2,
          recived: goals1,
          points: pointsTeam2
        }})
      return Object.values(teamStats);
}

async function initSeason(year) {

    const teamStats = await getMatchData(year,1);

    const emptyStats = teamStats.map(team => ({
    teamId: team.teamId,
    gamesPlayed: 0,
    win: 0,
    draw: 0,
    lost: 0,
    scored: 0,
    recived: 0,
    points: 0
  }));
  
      return Object.values(emptyStats);
}

export async function stageSeason(year) {
    const staged = await initSeason(year);
  displayTeams(staged);
}

export async function select() {
  seasonStats = {};
      currentMatchDay = 1;
      isPaused = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    if(selectYear.value !== "Select Year"){
      tableContainer.style.display = "block";
      playerContainer.style.display ="block";
      const year = selectYear.value;
      stageSeason(year)
    }
    else{
      tableContainer.style.display = "none";
      playerContainer.style.display = "none";
    }
}

export function playYear() {
  if(playImage.src.includes("/images/player-icons/play-button-arrowhead.png")) {
    isPaused = false;
    playSeason(selectYear.value);
    playImage.src = "/images/player-icons/pause.png"
  }
  else {
    isPaused = true;
    playImage.src = "/images/player-icons/play-button-arrowhead.png"
  }
}