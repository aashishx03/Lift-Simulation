"use strict";
const setup = document.querySelector(".setup");
const simulationArea = document.querySelector(".simulation-area");
const liftInput = document.getElementById("liftInput");
const floorInput = document.getElementById("floorInput");
const generateBtn = document.querySelector(".generate");
const btnUP = document.querySelector(".btn-up");
const btnDOWN = document.querySelector(".btn-down");

generateBtn.addEventListener("click", () => {
  const numberOffloors = floorInput.value;
  const numberOfLifts = liftInput.value;

  console.log(numberOfLifts, numberOffloors);

  if (!numberOfLifts && !numberOfLifts) {
    alert("Please Enter A Value");
    return;
  }

  for (let i = 0; i < numberOffloors; i++) {
    const floorHtml = `
    <div class="floor">
         <div class="one">
          <button class="btn-up ${i == numberOffloors - 1 ? "hidden" : ""}">
          <i class="bx bxs-up-arrow"></i>
        </button>
        <p>Floor ${i}</p>
        <button class="btn-down ${i == 0 ? "hidden" : ""}">
          <i class="bx bxs-down-arrow"></i>
        </button>
         </div>
         <div class="lift-area"></div>
      </div>
    `;
    simulationArea.insertAdjacentHTML("afterbegin", floorHtml);
  }

  for (let i = 0; i < numberOfLifts; i++) {
    const liftArea = document.querySelectorAll(".lift-area");
    const liftHtml = `<div class="lift"></div>`;
    console.log(liftArea);
    liftArea[liftArea.length - 1].insertAdjacentHTML("afterbegin", liftHtml);
  }

  liftInput.value = "";
  floorInput.value = "";
  setup.style.display = "none";
});
