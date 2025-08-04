import { teams } from "../data/teams.js";
import { displayTeams, tableContainer, displayMatches, displayTopScorrers } from "./main.js";
import { isPaused,seasonStats,selectYear } from "./buttons.js";

export let intervalId = null;
export let currentMatchDay = 1;


/* Play season for the selected year */
export async function playSeason(year,speed) {
  if(intervalId) return;

  /* Set interval for 34 times because season has 34 games */
  intervalId = setInterval(async ()=> {
    if(isPaused || currentMatchDay > 34) {
      clearInterval(intervalId);
      intervalId = null;
      return;
    }

   let teamStats = await getMatchData(year,currentMatchDay);
   /* Loads top scorrers from local storage if they exist*/
   let topScorrers = JSON.parse(localStorage.getItem("topScorrer")) || {};
   /* Ensures there are no goal duplicates */
   let seenGoalsIDs = new Set();

   teamStats.forEach(team => {
    const teamId = team.teamId;

    /* Saves data in the seasonStats and calculates statistics */
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
    }
    /* Getting goals from the match for top scorrer statistic */
    team.matchData.goals.forEach(goal => {
      const goalID = goal.goalID;

      if(!seenGoalsIDs.has(goalID) && goal.goalGetterID !== 0) {
        seenGoalsIDs.add(goalID);

        const scorrerID = goal.goalGetterID;
      if (topScorrers[scorrerID]){
        topScorrers[scorrerID].scored += 1;
      }
      else{
        topScorrers[scorrerID] = {
          goalID: goal.goalID,
          goalGetterID: scorrerID,
          goalGetterName: goal.goalGetterName,
          scored: 1
        }
      }}
      /* Saving top scorrers to local storage */
      localStorage.setItem("topScorrer",JSON.stringify(topScorrers));
    })
  }
  );
  
  /* Sorting and slicing top three scorrers */
  let sortedTopScorrers = Object.values(topScorrers).sort((a,b) => b.scored - a.scored).slice(0,3);
  /* Sorting the teams by points */
  let sortedSeason = Object.values(seasonStats).sort((a,b) => b.points - a.points);
  displayTopScorrers(sortedTopScorrers);
  displayTeams(sortedSeason);
  displayMatches(teamStats);
  currentMatchDay++;
  },speed) 
  
}

/* Getting data from API for the specific matchday of the selected season */
export async function getMatchData(year,matchDay) {
      const response = await fetch(`https://api.openligadb.de/getmatchdata/bl1/${year}/${matchDay}`);
      const data = await response.json();

      let teamStats = {};
      

      data.forEach(match => {
        /* Matching teams from API with my data teams */
        const matchingTeam1 = teams.find(team => team.teamId === match.team1.teamId);
        const matchingTeam2 = teams.find(team => team.teamId === match.team2.teamId);

        const id1 = matchingTeam1.teamId;
        const id2 = matchingTeam2.teamId;
        /* Getting match result after the end of the second half */
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
        
        const goals = match.goals.map(goal => ({
              goalID: goal.goalID,
              matchMinute: goal.matchMinute,
              scoreTeam1: goal.scoreTeam1,
              scoreTeam2: goal.scoreTeam2,
              goalGetterID: goal.goalGetterID,
              goalGetterName: goal.goalGetterName
              }))
        
          /* Comparing the goals from Team1 and Team2 and giving them points based on the result */
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

        /* Saving statistics from both teams into teamStats under the teamId */
        teamStats[id1] = {
          teamId: id1,
          gamesPlayed: gamesplayed,
          win: winTeam1,
          draw: draw,
          lost: lostTeam1,
          scored: goals1,
          recived: goals2,
          points: pointsTeam1,
          matchData:{
            matchId: match.matchID,
            score: {
              scoreTeam1: goals1,
              scoreTeam2: goals2
            },
            team1: match.team1.teamId,
            team2: match.team2.teamId,
            goals: goals
          }
        }
        teamStats[id2] = {
          teamId: id2,
          gamesPlayed: gamesplayed,
          win: winTeam2,
          draw: draw,
          lost: lostTeam2,
          scored: goals2,
          recived: goals1,
          points: pointsTeam2,
          matchData:{
            matchId: match.matchID,
            score: {
              scoreTeam1: goals1,
              scoreTeam2: goals2
            },
            team1: match.team1.teamId,
            team2: match.team2.teamId,
            goals: goals
          }
        }})
      /* Convert object into the array */
      return Object.values(teamStats);
}

/* Getting teams from the selected season and setting their statistics to zero */
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
    points: 0,
    matchData:{
            matchId: team.matchData.matchId,
            score: {
              scoreTeam1: 0,
              scoreTeam2: 0
            },
            team1: team.matchData.team1,
            team2: team.matchData.team2,
            goals: team.matchData.goals
          }
  }));
      return Object.values(emptyStats);
}

/* Displaying the begining of the season with empty stats of teams and players */
export async function stageSeason(year) {
    const staged = await initSeason(year);
    /* In players data goalGetterID: 10000000 is a default player */
    const stagedArray = [
      {
        goalGetterID: 10000000,
        scored: 0
      },
      {
        goalGetterID: 10000000,
        scored: 0
      },
      {
        goalGetterID: 10000000,
        scored: 0
      },
    ]
  displayTeams(staged);
  displayMatches(staged);
  displayTopScorrers(stagedArray);
}

/* Sets the current match day to selected value mostly to reset it to 1 */
export function setCurrentMatchDay(value) {
  currentMatchDay = value;
}

/* Resets interval of the season */
export function setIntervalId() {
  intervalId = null;
}