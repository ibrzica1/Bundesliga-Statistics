
export function moveBar(matchId,array) {
  const progressBar = document.getElementById(`js-progress-bar${matchId}`);
  if (!progressBar) {
      console.error(`Progress bar with ID js-progress-bar${matchId} not found.`);
      return;
  }
  let position = 0;

  function animate() {
    if (position < 99) {
      if(array.length > 0 && position === Number(array[0].matchMinute)) {
        
          setTimeout(()=>{
            displayMatchScorrers(array,matchId);
            updateResult(array,matchId);
            array.shift();
            position += 1;
            progressBar.style.width = position + "%";
            requestAnimationFrame(animate);
            
          },2000);
          return;
      }
        position += 1;
        progressBar.style.width = position + "%";
        requestAnimationFrame(animate);
      
    }
  }
  animate();
}

function updateResult(array,matchId){
    const scoreTeam1 = document.querySelector(`#js-score-team1-${matchId}`);
    const scoreTeam2 = document.querySelector(`#js-score-team2-${matchId}`);
    
    if(array.length > 0){
      const result = array[0];
      scoreTeam1.innerHTML = result.scoreTeam1;
      scoreTeam2.innerHTML = result.scoreTeam2;
    }
}

function displayMatchScorrers(array,matchId){
  const result = array[0];
  const scorrerGrid = document.querySelector(`#js-scorrerGrid-${matchId}`);
  const currentScoreTeam1 = document.querySelector(`#js-score-team1-${matchId}`);
  const currentScoreTeam2 = document.querySelector(`#js-score-team2-${matchId}`);
  const currentScore1 = parseInt(currentScoreTeam1.innerHTML);
  const currentScore2 = parseInt(currentScoreTeam2.innerHTML);
  const resultScore1 = parseInt(result.scoreTeam1);
  const resultScore2 = parseInt(result.scoreTeam2);

  let container1 = "";
  let container2 = "";
  
  console.log(resultScore1,currentScore1);
  if(array.length > 0) {
    if(resultScore1 > currentScore1){
      container1 = `${result.matchMinute} min   ${result.goalGetterName}`;
    }
    else if(resultScore2 > currentScore2) {
      container2 = `${result.goalGetterName}   ${result.matchMinute} min`;
    }
  }
  console.log(container1,container2);

  scorrerGrid.innerHTML += `
    <div class="scorrerContainer">
      <div class="scorrerTeam1">
        ${container1}
      </div>
      <div class="scorrerTeam2">
        ${container2}
      </div>
    </div> 
  `;
}

