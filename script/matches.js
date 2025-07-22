

export function moveBar(matchId,array) {
  const goal = document.querySelector(`#js-goal-notification-${matchId}`);
  const progressBar = document.getElementById(`js-progress-bar${matchId}`);
  const playBtn = document.getElementById(`js-match-play-btn${matchId}`);
  if (!progressBar) {
      console.error(`Progress bar with ID js-progress-bar${matchId} not found.`);
      return;
  }
  let position = 0;

  function animate() {
    if (position < 99) {
      playBtn.disabled = true;
      if(array.length > 0 && position === Number(array[0].matchMinute)) {
        
        const currentGoal = array[0];

          setTimeout(()=>{
            displayMatchScorrers([currentGoal],matchId);
            updateResult([currentGoal],matchId);
            array.shift();
            goal.style.left = `${position}%`;
            goal.style.opacity = 1;
            goal.style.transform = "translateX(-50%) translateY(-5px)";
            setTimeout(() => {
              goal.style.opacity = "0";
              goal.style.transform = "translateX(-50%) translateY(0)";
            }, 1500);
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
    else{
      playBtn.disabled = false;
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
  const emptyContainer = document.querySelector(`#js-empty-scorrer-container${matchId}`)
  const scorrerGrid = document.querySelector(`#js-scorrerGrid-${matchId}`);
  const currentScoreTeam1 = document.querySelector(`#js-score-team1-${matchId}`);
  const currentScoreTeam2 = document.querySelector(`#js-score-team2-${matchId}`);
  const currentScore1 = parseInt(currentScoreTeam1.innerHTML);
  const currentScore2 = parseInt(currentScoreTeam2.innerHTML);
  const resultScore1 = parseInt(result.scoreTeam1);
  const resultScore2 = parseInt(result.scoreTeam2);

  let goalScorerHtml = "";

  if (resultScore1 > currentScore1) {
    goalScorerHtml = `
      <div class="scorrerContainer">
        <div class="scorrerTeam1">
          ${result.matchMinute}´&nbsp;&nbsp;&nbsp;&nbsp;${result.goalGetterName}
        </div>
        <div class="scorrerTeam2"></div>
      </div>
    `;
  } else if (resultScore2 > currentScore2) {
    goalScorerHtml = `
      <div class="scorrerContainer">
        <div class="scorrerTeam1"></div>
        <div class="scorrerTeam2">
          ${result.goalGetterName}&nbsp;&nbsp;&nbsp;&nbsp;${result.matchMinute}´
        </div>
      </div>
    `;
  }

  if (emptyContainer) {
    emptyContainer.style.display = "none";
  }
  if (scorrerGrid) {
    scorrerGrid.innerHTML += goalScorerHtml;
  }
}

export function resetMatch(matchId) {
  
  const scoreTeam1 = document.querySelector(`#js-score-team1-${matchId}`);
  const scoreTeam2 = document.querySelector(`#js-score-team2-${matchId}`);
  if (scoreTeam1) scoreTeam1.innerHTML = "0";
  if (scoreTeam2) scoreTeam2.innerHTML = "0";
  
  const progressBar = document.querySelector(`#js-progress-bar${matchId}`);
  if (progressBar) progressBar.style.width = "0%";
 
  const scorrerGrid = document.querySelector(`#js-scorrerGrid-${matchId}`);
  if (scorrerGrid) scorrerGrid.innerHTML = `
    <div class="empty-scorrer-container" id="js-empty-scorrer-container${matchId}">
      <div class="scorrerTeam1"></div>
      <div class="scorrerTeam2"></div>
    </div>
  `;

  const emptyContainer = document.querySelector(`#js-empty-scorrer-container${matchId}`);
  if (emptyContainer) emptyContainer.style.display = "block";
}