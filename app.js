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

  const startRef = new Date(2025, 0, 1); // Référence de départ du roulement
  const dateDebut = new Date(année, 0, 1);
  const dateFin = new Date(année, 11, 31);
  const nbJours = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
  const decalage = Math.round((dateDebut - startRef) / (1000 * 60 * 60 * 24));
  const decalageCycle = ((decalage % cycleLength) + cycleLength) % cycleLength;

  // Charger les modifications locales enregistrées
  const modifs = JSON.parse(localStorage.getItem("modifications") || "{}");

  for (let i = 0; i < nbJours; i++) {
    const currentDate = new Date(dateDebut);
    currentDate.setDate(dateDebut.getDate() + i);

    const keyDate = currentDate.toLocaleDateString("fr-CA"); // AAAA-MM-JJ (clé stable pour stockage)
    const displayDate = currentDate.toLocaleDateString("fr-FR"); // JJ/MM/AAAA pour affichage

    const cycleIndex = (i + decalageCycle) % cycleLength;
    const defaultPosition = cycle[cycleIndex];
    const position = modifs[keyDate] || defaultPosition;

    const line = document.createElement("div");
    line.classList.add("planning-line");
    if (position === "R") line.classList.add("highlight-r");

    const span = document.createElement("span");
    span.textContent = `${position}    ${displayDate}`;
    line.appendChild(span);

    line.addEventListener("click", () => {
      const nouvellePosition = prompt(
        `Changer la position du ${displayDate} :`,
        position
      );

      if (nouvellePosition && nouvellePosition !== position) {
        modifs[keyDate] = nouvellePosition;
        localStorage.setItem("modifications", JSON.stringify(modifs));
        span.textContent = `${nouvellePosition}    ${displayDate}`;
        console.log(`Modification enregistrée : ${keyDate} → ${nouvellePosition}`);
      }
    });

    container.appendChild(line);
  }
});



