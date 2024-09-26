"use strict";
const setup = document.querySelector(".setup");
const simulationArea = document.querySelector(".simulation-area");
const liftInput = document.getElementById("liftInput");
const floorInput = document.getElementById("floorInput");
const generateBtn = document.querySelector(".generate");

let lifts = [];
let floors = [];
let floorRequests = {};

generateBtn.addEventListener("click", () => {
  const numberOfFloors = floorInput.value;
  const numberOfLifts = liftInput.value;

  if (!validateInput(numberOfFloors, numberOfLifts)) return;

  addFloors(numberOfFloors);
  addLifts(numberOfLifts);

  liftInput.value = "";
  floorInput.value = "";
  setup.style.display = "none";
});

function addFloors(numberOfFloors) {
  for (let i = 0; i < numberOfFloors; i++) {
    const floorHtml = `
      <div class="floor">
        <div class="one">
          <button onclick="${
            numberOfFloors >= 1 ? `callLift(${i}, 'up')` : ""
          }" class="${
      i == numberOfFloors - 1 ? "hidden" : ""
    }" data-floor="${i}">
            <i class="bx bxs-up-arrow"></i>
          </button>
          <p>Floor ${i}</p>
          <button onclick="${
            numberOfFloors > 1 ? `callLift(${i}, 'down')` : ""
          }" class="${i == 0 ? "hidden" : ""}" data-floor="${i}">
            <i class="bx bxs-down-arrow"></i>
          </button>
        </div>
        <div class="lift-area"></div>
      </div>
    `;
    simulationArea.insertAdjacentHTML("afterbegin", floorHtml);
    floors.push(floorHtml);
    floorRequests[i] = { up: false, down: false };
  }

  document.querySelectorAll(".btn-up").forEach((button) => {
    button.addEventListener("click", () =>
      callLift(parseInt(button.dataset.floor), "up")
    );
  });

  document.querySelectorAll(".btn-down").forEach((button) => {
    button.addEventListener("click", () =>
      callLift(parseInt(button.dataset.floor), "down")
    );
  });
}

function addLifts(numberOfLifts) {
  for (let i = 0; i < numberOfLifts; i++) {
    const liftArea = document.querySelectorAll(".lift-area");
    const liftHtml = `
      <div class="lift" data-id="${i}">
        <div class="left-door door"></div>
        <div class="right-door door"></div>
      </div>
    `;
    liftArea[liftArea.length - 1].insertAdjacentHTML("afterbegin", liftHtml);

    // Set initial position and status of lifts
    const liftElement = document.querySelector(`.lift[data-id="${i}"]`);

    const liftObj = {
      element: liftElement,
      currentFloor: 0,
      isBusy: false,
      queue: [],
    };
    lifts.push(liftObj);
  }
}

function callLift(requestedFloor, direction) {
  // Find the closest available lift

  if (floorRequests[requestedFloor][direction]) {
    console.log(
      `Request for ${direction} already active on floor ${requestedFloor}`
    );
    return;
  }

  floorRequests[requestedFloor][direction] = true;

  const closestLift = findClosestLift(requestedFloor, lifts);
  if (!closestLift) {
    console.log("No lifts available");
    return;
  }
  closestLift.queue.push({ floor: requestedFloor, direction: direction });
  console.log(
    `Assigned ${direction} request to lift at floor ${requestedFloor}`
  );
  processLiftRequests(closestLift);
}

function findClosestLift(requestedFloor, lifts) {
  let closestLift = null;
  let minDistance = Infinity;

  lifts.forEach((lift) => {
    if (!lift.isBusy) {
      const distance = Math.abs(lift.currentFloor - requestedFloor);
      if (distance < minDistance) {
        minDistance = distance;
        closestLift = lift;
      }
    }
  });

  return closestLift;
}

function processLiftRequests(lift) {
  if (lift.isBusy || lift.queue.length == 0) return;
  lift.isBusy = true;
  const request = lift.queue.shift();

  moveLift(lift, request.floor, request.direction);
}

function moveLift(lift, targetFloor, direction) {
  const floorHeight = 80; // Assuming each floor is 120px high
  const distance = Math.abs(targetFloor - lift.currentFloor);
  const travelTime = distance * 2000; // 2 seconds per floor

  // Move the lift
  lift.element.style.transition = `transform ${travelTime}ms ease-in-out`;
  lift.element.style.transform = `translateY(-${targetFloor * floorHeight}px)`;

  // Simulate opening and closing doors after the lift reaches the floor
  setTimeout(() => {
    lift.currentFloor = targetFloor; // Update the lift's current floor
    openDoors(lift);
    setTimeout(() => {
      closeDoors(lift);
      setTimeout(() => {
        lift.isBusy = false; // Mark the lift as available after doors close
        floorRequests[targetFloor][direction] = false; // Reset request for the direction
        console.log(`Request for ${direction} cleared on floor ${targetFloor}`);
        processLiftRequests(lift); // Continue processing this lift's queue
      }, 2500);
    }, 2500);
  }, travelTime);
}

function openDoors(lift) {
  const leftDoor = lift.element.querySelector(".left-door");
  const rightDoor = lift.element.querySelector(".right-door");
  leftDoor.classList.add("open");
  rightDoor.classList.add("open");
}

function closeDoors(lift) {
  const leftDoor = lift.element.querySelector(".left-door");
  const rightDoor = lift.element.querySelector(".right-door");
  leftDoor.classList.remove("open");
  rightDoor.classList.remove("open");
}

function validateInput(noOfFloors, noOfLifts) {
  if (isNaN(noOfFloors) || isNaN(noOfLifts)) {
    alert("Please Enter Valid Numeric Values");
    return false;
  } else if (!noOfFloors || !noOfLifts) {
    alert("Please Enter Valid Numbers");
    return false;
  } else if (noOfFloors <= 0 || noOfLifts <= 0) {
    alert("Please Enter Valid Numbers");
    return false;
  } else if (noOfFloors == 1 && noOfLifts > 1) {
    alert("We Can't Have More than one Lift on Single floor");
    return false;
  } else if (noOfFloors > 15) {
    alert("This Version of App Supports Only 15 Floors");
    return false;
  } else if (noOfLifts > 10) {
    alert("This Version of App Supports Only 10 lifts");
    return false;
  }
  return true;
}
