
export function moveBar(matchId,array) {
  const progressBar = document.getElementById(`js-progress-bar${matchId}`);
  if (!progressBar) {
      console.error(`Progress bar with ID js-progress-bar${matchId} not found.`);
      return;
  }
  let position = 0;

  function animate() {
    if (position < 90) {
      if(array.length > 0 && position === Number(array[0].matchMinute)) {
        
          setTimeout(()=>{
            array.shift();
            position += 1;
            progressBar.style.width = position + "%";
            console.log(position);
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



