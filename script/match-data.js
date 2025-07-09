import { teams } from "../data/teams.js";

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
        let gamesplayed = 0;
        let winTeam1;
        let winTeam2;
        let lostTeam1;
        let lostTeam2;
        let draw;
        let pointsTeam1;
        let pointsTeam2;
        
          if(goals1 > goals2) {
            winTeam1 = 1;
            winTeam2 = 0;
            lostTeam1 = 0;
            lostTeam2 = 1;
            draw = 0;
            pointsTeam1 = 3;
            pointsTeam2 = 0;  }
          else if(goals1 < goals2) {
            winTeam1 = 0;
            winTeam2 = 1;
            lostTeam1 = 1;
            lostTeam2 = 0;
            draw = 0;
            pointsTeam1 = 0;
            pointsTeam2 = 3;  }
          else if(goals1 === goals2) {
            winTeam1 = 0;
            winTeam2 = 0;
            lostTeam1 = 0;
            lostTeam2 = 0;
            draw = 1;
            pointsTeam1 = 1;
            pointsTeam2 = 1;  }
           
      
        if(match.matchIsFinished === true) {
          gamesplayed++
        }

        teamStats[id1] = {
          teamName: matchingTeam1.teamName,
          gamesplayed: gamesplayed,
          win: winTeam1,
          draw: draw,
          lost: lostTeam1,
          scored: goals1,
          recived: goals2,
          points: pointsTeam1
        }
        teamStats[id2] = {
          teamName: matchingTeam2.teamName,
          gamesplayed: gamesplayed,
          win: winTeam2,
          draw: draw,
          lost: lostTeam2,
          scored: goals2,
          recived: goals1,
          points: pointsTeam2
        }
        
      })
      console.log(teamStats)
    
}