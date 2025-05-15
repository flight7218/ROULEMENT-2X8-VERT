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

  const startRef = new Date(2025, 0, 1);
  const dateDebut = new Date(année, 0, 1);
  const dateFin = new Date(année, 11, 31);
  const nbJours = Math.round((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
  const decalage = Math.round((dateDebut - startRef) / (1000 * 60 * 60 * 24));
  const decalageCycle = ((decalage % cycleLength) + cycleLength) % cycleLength;

  // Récupération des modifications depuis le localStorage
  const stockage = JSON.parse(localStorage.getItem("modifsPlanning") || "{}");

  for (let i = 0; i < nbJours; i++) {
    const currentDate = new Date(dateDebut);
    currentDate.setDate(dateDebut.getDate() + i);
    const dateString = currentDate.toISOString().split("T")[0]; // au format YYYY-MM-DD

    const cycleIndex = (i + decalageCycle) % cycleLength;
    const position = stockage[dateString] || cycle[cycleIndex];

    const line = document.createElement("div");
    line.classList.add("planning-line");
    if (position === "R") line.classList.add("highlight-r");

    const span = document.createElement("span");
    span.textContent = `${position}    ${currentDate.toLocaleDateString("fr-FR")}`;
    span.style.cursor = "pointer";

    // Ajout d'un événement au clic pour modifier la position
    span.addEventListener("click", () => {
      const nouvelleValeur = prompt("Nouvelle position pour le " + currentDate.toLocaleDateString("fr-FR") + " :", position);
      if (nouvelleValeur !== null && nouvelleValeur.trim() !== "") {
        stockage[dateString] = nouvelleValeur.trim().toUpperCase();
        localStorage.setItem("modifsPlanning", JSON.stringify(stockage));
        document.getElementById("generateBtn").click(); // recharge le planning
      }
    });

    line.appendChild(span);
    container.appendChild(line);
  }
});


