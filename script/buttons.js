import { stageSeason, playSeason,intervalId,currentMatchDay,setCurrentMatchDay, setIntervalId } from "./match-data.js";
import { selectYear,tableContainer } from "./main.js";

export let seasonStats = {};
export let isPaused = false;


const playImage = document.querySelector(".play-btn-img");
const playerContainer = document.querySelector(".player-wrapper");

export function stopYear(){
    seasonStats = {};
    clearInterval(intervalId);
    setIntervalId();
    const year = selectYear.value;
    stageSeason(year);
    playImage.src = "/images/player-icons/play-button-arrowhead.png";
}


export function playYear() {
  if(playImage.src.includes("/images/player-icons/play-button-arrowhead.png")) {
    isPaused = false;
    playSeason(selectYear.value);
    playImage.src = "/images/player-icons/pause.png"
  }
  else {
    isPaused = true;
    playImage.src = "/images/player-icons/play-button-arrowhead.png";
  }
}

export async function select() {
  seasonStats = {};
      setCurrentMatchDay(1);
      isPaused = false;
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId();
      }
    if(selectYear.value !== "Select Year"){
      tableContainer.style.display = "block";
      playerContainer.style.display ="block";
      const year = selectYear.value;
      stageSeason(year)
      playImage.src = "/images/player-icons/play-button-arrowhead.png";
    }
    else{
      tableContainer.style.display = "none";
      playerContainer.style.display = "none";
    }
}