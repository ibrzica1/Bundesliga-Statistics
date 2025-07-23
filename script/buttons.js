import { stageSeason, playSeason,intervalId,currentMatchDay,setCurrentMatchDay, setIntervalId } from "./match-data.js";
import { tableContainer } from "./main.js";
import { resetScorrers } from "./top-scorrer.js";


export let seasonStats = {};
export let isPaused = false;
export const selectYear = document.getElementById("js-select-year");
const playImage = document.querySelector(".play-btn-img");
const playerContainer = document.querySelector(".player-wrapper");

export function stopYear(){
    seasonStats = {};
    clearInterval(intervalId);
    setIntervalId();
    const year = selectYear.value;
    stageSeason(year);
    playImage.src = "/images/player-icons/play-button-arrowhead.png";
    resetScorrers();
}

export function playYear() {
  if(playImage.src.includes("/images/player-icons/play-button-arrowhead.png")) {
    isPaused = false;
    playSeason(selectYear.value,2000);
    playImage.src = "/images/player-icons/pause.png"
  }
  else {
    isPaused = true;
    playImage.src = "/images/player-icons/play-button-arrowhead.png";
  }
}

export async function select() {
  resetScorrers();
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

export function previousYear() {
  resetScorrers();
    let year = selectYear.value;
    if (year > 2010) {
      seasonStats = {};
      setCurrentMatchDay(1);
      isPaused = false;
      clearInterval(intervalId);
      setIntervalId();
      year--
      selectYear.value = year;
      stageSeason(year);
      playImage.src = "/images/player-icons/play-button-arrowhead.png";
    }
    else {
      selectYear.value = 2010;
      stageSeason(2010);
      seasonStats = {};
      setCurrentMatchDay(1);
      isPaused = false;
      clearInterval(intervalId);
      setIntervalId();
      playImage.src = "/images/player-icons/play-button-arrowhead.png";
      return;
    }
}

export function nextYear() {
  resetScorrers();
    let year = selectYear.value;
    if (year < 2024) {
      seasonStats = {};
      setCurrentMatchDay(1);
      isPaused = false;
      clearInterval(intervalId);
      setIntervalId();
      year++
      selectYear.value = year;
      stageSeason(year);
      playImage.src = "/images/player-icons/play-button-arrowhead.png";
    }
    else {
      selectYear.value = 2024;
      stageSeason(2024);
      seasonStats = {};
      setCurrentMatchDay(1);
      isPaused = false;
      clearInterval(intervalId);
      setIntervalId();
      playImage.src = "/images/player-icons/play-button-arrowhead.png";
      return;
    }
}

export function normalSpeed(){
  clearInterval(intervalId);
  setIntervalId();
  const speed = 2000;
  playSeason(selectYear.value,speed);
}

export function doubleSpeed(){
  clearInterval(intervalId);
  setIntervalId();
  const speed = 1000;
  playSeason(selectYear.value,speed);
}

export function tripleSpeed(){
  clearInterval(intervalId);
  setIntervalId();
  const speed = 500;
  playSeason(selectYear.value,speed);
}