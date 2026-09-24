const DEFAULT_PHOTO = makePlaceholder("PLAYER");

const state = {
  version: 1,
  target: 10,
  players: {
    A: { name: "ROMMEL", photo: DEFAULT_PHOTO, score: 0, rounds: 0 },
    B: { name: "SHAY", photo: DEFAULT_PHOTO, score: 0, rounds: 0 }
  },
  currentRound: 1,
  history: [],
  savedAt: null
};

let roundUndoStack = [];

const $ = (id) => document.getElementById(id);

function makePlaceholder(text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <rect width="100%" height="100%" fill="#e8e8e8"/>
    <circle cx="150" cy="112" r="48" fill="#bcbcbc"/>
    <path d="M55 275c8-67 48-94 95-94s87 27 95 94" fill="#bcbcbc"/>
    <text x="150" y="292" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#666">${text}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function render() {
  $("targetDisplay").textContent = state.target;
  $("targetInput").value = state.target;

  for (const p of ["A", "B"]) {
    const x = state.players[p];
    $(`name${p}`).value = x.name;
    $(`score${p}`).textContent = x.score;
    $(`rounds${p}`).textContent = x.rounds;
    $(`photoPreview${p}`).src = x.photo || DEFAULT_PHOTO;
  }

  const finished = state.players.A.score >= state.target || state.players.B.score >= state.target;
  $("matchStatus").textContent = finished ? "MATCH TARGET REACHED" : "MATCH IN PROGRESS";
  $("matchStatus").classList.toggle("finished", finished);

  $("winnerA").textContent = state.players.A.name || "PLAYER A";
  $("winnerB").textContent = state.players.B.name || "PLAYER B";

  renderHistory();
}

function renderHistory() {
  const body = $("historyBody");
  if (!state.history.length) {
    body.innerHTML = `<tr><td colspan="5" class="empty">No completed rounds yet.</td></tr>`;
  } else {
    body.innerHTML = state.history.map((h, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(h.date)}</td>
        <td><strong>${escapeHtml(h.winner)}</strong></td>
        <td>${h.scoreA} - ${h.scoreB}</td>
        <td>${h.round}</td>
      </tr>
    `).join("");
  }

  const winsA = state.history.filter(h => h.player === "A").length;
  const winsB = state.history.filter(h => h.player === "B").length;
  $("historySummary").innerHTML = `
    <div class="summary-card"><strong>${winsA}</strong><span>${escapeHtml(state.players.A.name)} round wins</span></div>
    <div class="summary-card"><strong>${winsB}</strong><span>${escapeHtml(state.players.B.name)} round wins</span></div>
    <div class="summary-card"><strong>${state.history.length}</strong><span>Total recorded rounds</span></div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function snapshot() {
  return JSON.parse(JSON.stringify({
    target: state.target,
    players: state.players,
    currentRound: state.currentRound
  }));
}

function restoreSnapshot(s) {
  state.target = s.target;
  state.players = s.players;
  state.currentRound = s.currentRound;
}

function markUnsaved() {
  state.savedAt = null;
  $("saveState").textContent = "Changes not saved";
}

function changeScore(player, amount) {
  const p = state.players[player];
  p.score = Math.max(0, p.score + amount);
  markUnsaved();
  render();
}

function addRoundWin(player) {
  const before = snapshot();
  state.players[player].rounds++;
  state.history.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: new Date().toLocaleString(),
    winner: state.players[player].name,
    player,
    scoreA: state.players.A.score,
    scoreB: state.players.B.score,
    round: state.currentRound,
    type: "round-win"
  });
  roundUndoStack.push({ before, historyLength: state.history.length - 1, round: state.currentRound });
  state.currentRound++;
  markUnsaved();
  render();
}

function openRoundModal() {
  $("roundModal").classList.remove("hidden");
}

function closeRoundModal() {
  $("roundModal").classList.add("hidden");
}

function recordNextRound(player) {
  closeRoundModal();
  addRoundWin(player);
}

async function saveJSON() {
  const data = JSON.stringify({
    app: "Billiard Scoreboard",
    version: 1,
    exportedAt: new Date().toISOString(),
    target: state.target,
    players: state.players,
    currentRound: state.currentRound,
    history: state.history
  }, null, 2);

  try {
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: "billiard-scoreboard.json",
        types: [{ description: "JSON file", accept: { "application/json": [".json"] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
    } else {
      const blob = new Blob([data], {type: "application/json"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "billiard-scoreboard.json";
      a.click();
      URL.revokeObjectURL(a.href);
    }

    state.savedAt = new Date();
    $("saveState").textContent = "Saved " + state.savedAt.toLocaleTimeString();
  } catch (err) {
    if (err.name !== "AbortError") alert("Could not save JSON: " + err.message);
  }
}

function loadJSON() {
  $("jsonFile").click();
}

$("jsonFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    if (!data.players || !data.history) throw new Error("Invalid scoreboard JSON.");

    state.target = Number(data.target) || 10;
    state.players = {
      A: {
        name: data.players.A?.name || "PLAYER A",
        photo: data.players.A?.photo || DEFAULT_PHOTO,
        score: Number(data.players.A?.score) || 0,
        rounds: Number(data.players.A?.rounds) || 0
      },
      B: {
        name: data.players.B?.name || "PLAYER B",
        photo: data.players.B?.photo || DEFAULT_PHOTO,
        score: Number(data.players.B?.score) || 0,
        rounds: Number(data.players.B?.rounds) || 0
      }
    };
    state.currentRound = Number(data.currentRound) || 1;
    state.history = Array.isArray(data.history) ? data.history : [];
    roundUndoStack = [];
    state.savedAt = new Date();
    $("saveState").textContent = "Loaded " + state.savedAt.toLocaleTimeString();
    render();
  } catch (err) {
    alert("Invalid JSON file: " + err.message);
  } finally {
    e.target.value = "";
  }
});

$("saveBtn").addEventListener("click", saveJSON);
$("loadBtn").addEventListener("click", loadJSON);

$("targetInput").addEventListener("change", () => {
  state.target = Math.max(1, Number($("targetInput").value) || 10);
  markUnsaved();
  render();
});

for (const p of ["A", "B"]) {
  $(`name${p}`).addEventListener("input", e => {
    state.players[p].name = e.target.value.toUpperCase();
    markUnsaved();
    render();
  });

  $(`photo${p}`).addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image.");

    const reader = new FileReader();
    reader.onload = () => {
      state.players[p].photo = reader.result;
      $(`photoName${p}`).textContent = file.name;
      markUnsaved();
      render();
    };
    reader.readAsDataURL(file);
  });
}

document.querySelectorAll("[data-action='score']").forEach(btn => {
  btn.addEventListener("click", () => changeScore(btn.dataset.player, Number(btn.dataset.value)));
});

document.querySelectorAll("[data-action='round']").forEach(btn => {
  btn.addEventListener("click", () => addRoundWin(btn.dataset.player));
});

$("nextRoundBtn").addEventListener("click", openRoundModal);
$("cancelRound").addEventListener("click", closeRoundModal);

$("winnerA").addEventListener("click", () => recordNextRound("A"));
$("winnerB").addEventListener("click", () => recordNextRound("B"));

$("undoBtn").addEventListener("click", () => {
  const last = roundUndoStack.pop();
  if (!last) return alert("There is no round to undo.");

  restoreSnapshot(last.before);
  state.history.splice(last.historyLength);
  markUnsaved();
  render();
});

$("clearHistoryBtn").addEventListener("click", () => {
  if (!state.history.length) return;
  if (!confirm("Clear all winner history? This cannot be undone unless you reload an older JSON file.")) return;
  state.history = [];
  roundUndoStack = [];
  markUnsaved();
  render();
});

$("resetBtn").addEventListener("click", () => {
  if (!confirm("Reset the current match? Winner history will be kept.")) return;
  state.players.A.score = 0;
  state.players.B.score = 0;
  state.players.A.rounds = 0;
  state.players.B.rounds = 0;
  state.currentRound = 1;
  roundUndoStack = [];
  markUnsaved();
  render();
});

render();
