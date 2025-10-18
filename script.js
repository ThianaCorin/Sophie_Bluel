// ==========================
// Récupérer les works depuis l'API :
// ==========================
// (Await a besoin d'une fonction async)
// GET est le verbe utilisé par défaut sur la fonction fetch
// ==========================

let works = [];

async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  loadWorks(); // affiche tout au démarrage
}
// ==========================
// On appelle la fonction
// ==========================
fetchWorks();


// ==========================
// Fonction d'affichage des works (avec filtre). On met "0" par défaut
// ==========================

function loadWorks(filterId = "0") {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // vider la galerie avant d'ajouter les nouvelles images

  let worksToDisplay;
  if (filterId == "0") {
    worksToDisplay = works; // toutes les works
  } else {
    worksToDisplay = works.filter(work => work.categoryId == filterId); // affiche les works du 
    // filtre choisi
  }

// ==========================
  // Créer les figures et les attacher à la gallerie
  // ==========================

  for (let i = 0; i < worksToDisplay.length; i++) {
    const work = worksToDisplay[i];
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

// ==========================
// Gestion des boutons de filtres
// ==========================

const buttons = document.querySelectorAll(".filters button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    // Mettre à jour le bouton actif
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Récupérer la catégorie du bouton cliqué
    const category = button.dataset.category;

    // Charger les works correspondants
    loadWorks(category);
  });
});
