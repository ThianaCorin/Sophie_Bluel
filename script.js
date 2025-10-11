// Récupèrer works de l'API - (fetch a besoin de la fonction async)

async function loadWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();

  const gallery = document.querySelector('.gallery');

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

// Préparer le HTML à recevoir les figures:
  // créer la balise <figure>
  const figure = document.createElement("figure");

  // créer l'image
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  // créer la légende
  const figcaption = document.createElement("figcaption");
  figcaption.innerText = work.title;

  // assembler les éléments
  figure.appendChild(img);
  figure.appendChild(figcaption);
  // ajouter la figure complète à la galerie
  gallery.appendChild(figure);    
  }
}

loadWorks();
