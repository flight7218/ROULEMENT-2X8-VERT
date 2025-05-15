document.getElementById("generateBtn").addEventListener("click", () => {
  const container = document.getElementById("planningContainer");
  container.innerHTML = "";

  const annéeInput = document.getElementById("annee").value;
  const année = parseInt(annéeInput);

  if (isNaN(année) || année < 1900 || année > 2100) {
    alert("Veuillez entrer une année valide entre 1900 et 2100.");
    return;
  }

  const cycle = ["R", "R", "A", "A", "A", "B", "B", "B", "R"];
  const cycleLength = cycle.length;

  const startRef = new Date(2025, 0, 1); // 1er janvier 2025
  const dateDebut = new Date(année, 0, 1);
  const dateFin = new Date(année, 11, 31);

  const nbJours = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;

  const decalage = Math.round((dateDebut - startRef) / (1000 * 60 * 60 * 24));
  const decalageCycle = ((decalage % cycleLength) + cycleLength) % cycleLength;

  // Récupère les modifications enregistrées depuis localStorage
  const modifications = JSON.parse(localStorage.getItem("modifs") || "{}");

  for (let i = 0; i < nbJours; i++) {
    const currentDate = new Date(dateDebut);
    currentDate.setDate(dateDebut.getDate() + i);

    const keyDate = currentDate.toLocaleDateString("fr-CA");    // Pour stocker : AAAA-MM-JJ
    const displayDate = currentDate.toLocaleDateString("fr-FR"); // Pour afficher : JJ/MM/AAAA

    const cycleIndex = (i + decalageCycle) % cycleLength;
    let position = cycle[cycleIndex];

    if (modifications[keyDate]) {
      position = modifications[keyDate];
    }

    const line = document.createElement("div");
    line.classList.add("planning-line");
    if (position === "R") line.classList.add("highlight-r");

    const span = document.createElement("span");
    span.textContent = `${position}    ${displayDate}`;
    span.style.cursor = "pointer";

    // ➕ Ajouter l'écouteur de clic pour modifier la position
    span.addEventListener("click", () => {
      const newPos = prompt("Nouvelle position (ex: CA, RC, ASA13, M, etc.) :", position);
      if (newPos !== null && newPos.trim() !== "") {
        modifications[keyDate] = newPos.trim();
        localStorage.setItem("modifs", JSON.stringify(modifications));
        span.textContent = `${newPos.trim()}    ${displayDate}`;
      }
    });

    line.appendChild(span);
    container.appendChild(line);
  }
});




