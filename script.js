let Soldiers =
  JSON.parse(localStorage.getItem("soldiers")).sort((a, b) =>
    a.FullName.localeCompare(b.FullName)
  ) || [];

//selectors
const inputFullName = document.querySelector("#input-full-name");
const inputRank = document.querySelector("#input-rank");
const inputPosition = document.querySelector("#input-position");
const inputPlatoon = document.querySelector("#input-platoon");
const inputMissionTime = document.querySelector("#input-mission-time");
const selectStatus = document.querySelector("#select-status");
const form = document.querySelector("form");
const fnBtn = document.querySelector("#fnBtn");

//event lisener
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addSoldier();
  renderer(); // Render todos after adding
});
fnBtn.addEventListener("click", () => {
  Soldiers = Soldiers.reverse();
  renderer();
});

//functions
function addSoldier() {
  const newSoldier = {
    id: generateId(),
    FullName: inputFullName.value,
    Rank: inputRank.value,
    Position: inputPosition.value,
    Platoon: inputPlatoon.value,
    MissionTime: inputMissionTime.value,
    Status: selectStatus.value,
  };
  Soldiers.push(newSoldier);
  localStorage.setItem("soldiers", JSON.stringify(Soldiers));
  inputFullName.value = "";
  inputRank.value = "";
  inputPosition.value = "";
  inputPlatoon.value = "";
  inputMissionTime.value = "";
  selectStatus.value = "";
}
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
function renderer() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  Soldiers.forEach((soldier) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${soldier.FullName}</td>
    <td>${soldier.Rank}</td>
    <td>${soldier.Position}</td>
    <td>${soldier.Platoon}</td>
    <td>${soldier.Status}</td>
    <td>
    <button class="remove">remove</button>
    ${
      soldier.Status !== "retired"
        ? `<button class="mission">mission</button>`
        : ""
    }
    <button class="edit">edit</button>

    </td>
    `;

    const removeBtn = tr.querySelector(".remove");
    const editBtn = tr.querySelector(".edit");
    const missionBtn = tr.querySelector(".mission");
    removeBtn.addEventListener("click", () => {
      removeSoldier(soldier.id);
      renderer();
    });
    editBtn.addEventListener("click", () => {
      editSoldier(soldier.id);
      renderer();
    });
    missionBtn.addEventListener("click", () => {
      let countdown = setInterval(() => {
        if (soldier.MissionTime >= 0) {
            missionBtn.textContent = soldier.MissionTime;
            soldier.MissionTime--;
        } else {
          missionBtn.textContent = "mission"; // Switch player when timer runs out
        }
      }, 1000);;
    });
    tbody.appendChild(tr);
  });
}

function removeSoldier(id) {
  const index = Soldiers.findIndex((soldier) => soldier.id === id);
  Soldiers.splice(index, 1);
  save();
  renderer();
}
function editSoldier(id) {
  const index = Soldiers.findIndex((soldier) => soldier.id === id);
  document.querySelector("#editpopup").style.display = "block";

  document.querySelector("#edit-full-name").value = Soldiers[index].FullName;
  document.querySelector("#edit-rank").value = Soldiers[index].Rank;
  document.querySelector("#edit-position").value = Soldiers[index].Position;
  document.querySelector("#edit-platoon").value = Soldiers[index].Platoon;
  document.querySelector("#edit-mission-time").value =
    Soldiers[index].MissionTime;
  document.querySelector("#edit-status").value = Soldiers[index].Status;

  document.querySelector("#saveedit").onclick = function () {
    Soldiers[index].FullName = document.querySelector("#edit-full-name").value;
    Soldiers[index].Rank = document.querySelector("#edit-rank").value;
    Soldiers[index].Position = document.querySelector("#edit-position").value;
    Soldiers[index].Platoon = document.querySelector("#edit-platoon").value;
    Soldiers[index].MissionTime =
      document.querySelector("#edit-mission-time").value;
    Soldiers[index].Status = document.querySelector("#edit-status").value;

    save();
    renderer();
    document.querySelector("#editpopup").style.display = "none";
  };

  document.querySelector("#canceledit").onclick = function () {
    document.querySelector("#editpopup").style.display = "none";
  };
}
function save() {
  localStorage.setItem("soldiers", JSON.stringify(Soldiers));
}


renderer();
