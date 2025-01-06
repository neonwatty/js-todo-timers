import { resetTimerBlurEvents } from "./blur.js";
import { resetTimerDrag } from "./drag.js";
import { updateFocus } from "./focus.js";
import { firstTimeId } from "./initialize.js";
import { deleteDict } from "./localStorage.js";
import { flickerHoverClass, removeHoverClassIfMobile } from "./mobile.js";
import { TimerFunc } from "./timer.js";

const timerContainer = document.querySelector("#timers-inner-container");
const addTimerButton = document.querySelector("#add-timer-button");
const removeTimerButton = document.querySelector("#remove-timer-button");

let idCounter = 0;
let firstTimeFlag = true;

export function createNewTimer(
  privateTimerName,
  timerName = "",
  timerNotes = "",
  hoursToAdd = 0,
  minutesToAdd = 0,
  secondsToAdd = 0,
) {
  // create id namespace
  const timerContainer = document.querySelector("#timers-inner-container");
  const timerElement = timerContainer.querySelector(`#${privateTimerName}`);

  // if it doesn't exist create it - both the div and timer functionality
  if (!timerElement && idCounter < 10) {
    // create new div
    createNewTimerDiv(privateTimerName);

    // create new timer functionality
    let newTimerFunc = new TimerFunc(
      privateTimerName,
      timerName,
      timerNotes,
      hoursToAdd,
      minutesToAdd,
      secondsToAdd,
    );

    // reset blur and drag events for timers
    resetTimerBlurEvents();
    resetTimerDrag();
  }
}

function createNewTimerDiv(id) {
  const timerDiv = `
            <div
            id=${id}
            class="timer-container w-full h-2/3 md:h-1/3 mt-5 flex flex-row rounded-3xl border border-slate-800 dark:border-slate-200 focus:bg-slate-500 focus:outline-none"
            tabindex="0"
            draggable="true"
          >
            <div
              class="w-1/2 lg:w-2/3 h-full font-sans flex flex-col items-center justify-start text-md"
            >
              <div
                class="w-full sm:w-2/3 h-full pt-3 md:h-2/3 flex flex-col lg:flex-row lg:space-x-7 items-center justify-center md:pr-10 border border-t-0 border-l-0 border-r-0 lg:border-r-1 lg:border-r-0 border-b-0 border-slate-800 dark:border-slate-200"
                id="timer-dash"
              >
                <div class="flex flex-col text-right items-center md:items-end">
                  <input
                    class="text-3xl text-right w-1/3 h-2/3 md:w-4/5 md:h-1/4 text-slate-800 dark:text-slate-200 bg-slate-300 dark:bg-slate-700 border border-slate-100 dark:border-slate-900"
                    type="number"
                    id="hours-entry"
                    min="0"
                    value="0"
                    inputmode="numeric"
                    pattern="[0-9]*"  
                  />
                  <div id="hours-label">hours</div>
                </div>
                <div class="flex flex-col text-right items-center md:items-end">
                  <input
                    class="text-3xl text-right w-1/3 h-2/3 md:w-4/5 md:h-1/4 text-slate-800 dark:text-slate-200 bg-slate-300 dark:bg-slate-700 border border-slate-100 dark:border-slate-900"
                    type="number"
                    id="minutes-entry"
                    min="0"
                    value="0"
                    inputmode="numeric"
                    pattern="[0-9]*"  
                  />
                  <div id="minutes-label">minutes</div>
                </div>
                <div class="flex flex-col text-right items-center md:items-end">
                  <input
                    class="text-3xl text-right w-1/3 h-2/3 md:w-4/5 md:h-1/4 text-slate-800 dark:text-slate-200 bg-slate-300 dark:bg-slate-700 border border-slate-800 dark:border-slate-200"
                    type="number"
                    id="seconds-entry"
                    min="0"
                    value="0"
                    inputmode="numeric"
                    pattern="[0-9]*"
                  />
                  <div id="seconds-label">seconds</div>
                </div>
              </div>
              <div
                class="w-full h-1/3 pt-3 pb-3 flex flex-row items-center justify-center space-x-5 lg:space-x-7 px-5 border border-t-1 border-l-0 border-r-0 border-b-0 border-slate-800 dark:border-slate-200"
                id="timer-buttons"
              >
                <div
                  class="px-1 lg:px-0 w-1/3 h-1/2 bg-green-500 flex items-center justify-center text-lg text-center rounded-2xl text-slate-800 dark:text-slate-200 border border-slate-800 dark:border-slate-200 hover hover:bg-green-700 cursor-pointer active active:bg-green-400"
                  id="start-button"
                >
                  ▶
                </div>
                <div
                  class="px-1 lg:px-0 w-1/3 h-1/2 py-1.5 bg-red-500 flex items-center justify-center text-xs text-center rounded-2xl text-slate-800 dark:text-slate-200 border border-slate-800 dark:border-slate-200 hover hover:bg-red-700 cursor-pointer active active:bg-red-400"
                  id="pause-button"
                >
                  ▐▐
                </div>
                <div
                  class="px-1 lg:px-0 w-1/3 h-1/2 bg-blue-500 flex items-center justify-center text-xl text-center rounded-2xl text-slate-800 dark:text-slate-200 border border-slate-800 dark:border-slate-200 hover hover:bg-blue-700 cursor-pointer active active:bg-blue-400"
                  id="reset-button"
                >
                  ↻
                </div>
              </div>
            </div>
            <div id="timer-metadata" class="flex flex-row pb-3 pl-1 border border-l-1 border-t-0 border-r-0 border-b-0 w-1/2 lg:w-1/3 h-auto lg:h-1/2">
              <div
                class="flex flex-col w-2/3 p-2"
              >
                <label for="timer-name">Name:</label>
                <input
                  type="text"
                  id="timer-name"
                  name="timer-name"
                  minlength="0"
                  maxlength="30"
                  inputmode="text"
                  class="bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-200 mb-2"
                />
                <label for="timer-notes">Notes:</label>
                <textarea
                  type="text"
                  id="timer-notes"
                  name="timer-notes"
                  rows=1
                  inputmode="text"
                  class="h-full bg-slate-400 dark:bg-slate-600 text-slate-800 dark:text-slate-200 text-left"
                ></textarea>
              </div>
              <div
                  class="w-1/3 h-1/8 lg:h-1/2 my-auto mr-2 bg-green-500 flex items-center justify-center text-lg text-center rounded-2xl text-slate-800 dark:text-slate-200 border border-slate-800 dark:border-slate-200 hover hover:bg-green-700 cursor-pointer active active:bg-green-400"
                  id="save-button"
                >
                  💾
              </div>
            </div>
          </div>`;

  // insert new timer div into main dom element for timers
  timerContainer.insertAdjacentHTML("beforeend", timerDiv);
}

function add() {
  if (firstTimeFlag) {
    idCounter = firstTimeId + 1;
    firstTimeFlag = false;
  }

  // create new timer div
  const timerName = `my-timer-${idCounter}`;
  createNewTimer(timerName);

  // update counter
  idCounter++;
}

function remove() {
  const focusId = updateFocus();
  const removeElement = document.getElementById(focusId);
  if (removeElement) {
    // delete element data from local storage
    deleteDict(focusId);

    // delete element div
    removeElement.classList.add("fade-out");
    setTimeout(() => {
      removeElement.remove();
    }, 600);

    // reset timer blur and drag events
    resetTimerBlurEvents();
    resetTimerDrag();
  }
}

// document.addEventListener("load", () => {
removeHoverClassIfMobile(removeTimerButton);
removeTimerButton.addEventListener("click", remove);
removeTimerButton.addEventListener("click", () =>
  flickerHoverClass(removeTimerButton),
);

removeHoverClassIfMobile(addTimerButton);
addTimerButton.addEventListener("click", add);
addTimerButton.addEventListener("click", () =>
  flickerHoverClass(addTimerButton),
);
// });
