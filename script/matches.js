
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
            updateResult(array,matchId);
            array.shift();
            position += 1;
            progressBar.style.width = position + "%";
            console.log(position,array);
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

