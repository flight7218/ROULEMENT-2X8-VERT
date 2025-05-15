document.getElementById("generateBtn").addEventListener("click", () => {
  const container = document.getElementById("planningContainer");
  container.innerHTML = "";
  const modifications = {}; // stocke les modifs ici

  const annéeInput = document.getElementById("annee").value;
  const année = parseInt(annéeInput);

  if (isNaN(année) || année < 1900 || année > 2100) {
    alert("Veuillez entrer une année valide entre 1900 et 2100.");
    return;
  }

  const cycle = ["R", "R", "A", "A", "A", "B", "B", "B", "R"];
  const cycleLength = cycle.length;

  const startRef = new Date(2025, 0, 1);
  const dateDebut = new Date(année, 0, 1);
  const dateFin = new Date(année, 11, 31);
  const nbJours = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;

  const decalage = Math.round((dateDebut - startRef) / (1000 * 60 * 60 * 24));
  const decalageCycle = ((decalage % cycleLength) + cycleLength) % cycleLength;

  for (let i = 0; i < nbJours; i++) {
    const currentDate = new Date(dateDebut);
    currentDate.setDate(dateDebut.getDate() + i);
    const dayString = currentDate.toISOString().split("T")[0]; // format YYYY-MM-DD

    const cycleIndex = (i + decalageCycle) % cycleLength;
    let position = cycle[cycleIndex];

    const line = document.createElement("div");
    line.classList.add("planning-line");
    if (position === "R") line.classList.add("highlight-r");

    const span = document.createElement("span");
    span.textContent = `${position}`;
    span.style.cursor = "pointer";
    span.style.marginRight = "10px";

    span.addEventListener("click", () => {
      const newVal = prompt(`Modifier la position du ${dayString}`, span.textContent);
      if (newVal && newVal.trim() !== "") {
        modifications[dayString] = newVal.trim();
        span.textContent = newVal.trim();
        document.getElementById("statusMessage").textContent =
          `Modification enregistrée : ${dayString} → ${newVal.trim()}`;
      }
    });

    line.appendChild(span);
    line.appendChild(document.createTextNode(dayString));
    container.appendChild(line);
  }

  // Export des modifs
  document.getElementById("exportBtn").onclick = () => {
    if (Object.keys(modifications).length === 0) {
      alert("Aucune modification à exporter.");
      return;
    }

    const blob = new Blob([JSON.stringify(modifications, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modifs_${année}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
});

