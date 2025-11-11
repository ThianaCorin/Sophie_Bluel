// ==========================
// Récupérer les works depuis l'API :
// ==========================
// (Await a besoin d'une fonction async)
// GET est le verbe utilisé par défaut sur la fonction fetch
// ==========================
// DOMContentLoaded: le code sera exécuté une fois que le DOM est entièrement chargé
document.addEventListener("DOMContentLoaded", () => {

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
  // Fonction d'affichage des filtres.
  // ==========================
  let categories = [];

  async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
    Filters()
    SelectCategorie()
  }

  fetchCategories();

  // Recupère les catégories pour les filtres de la page d'accueil

  function Filters() {
    const loadFilters = document.querySelector(".filters");
    loadFilters.innerHTML = "";
    // Bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.dataset.category = "0";
    allButton.classList.add("active");
    loadFilters.appendChild(allButton);

    // Boutons pour chaque catégorie recuperé de l’API
    categories.forEach(category => {
      const btn = document.createElement("button");
      btn.textContent = category.name;
      btn.dataset.category = category.id;
      loadFilters.appendChild(btn);
    });

    // Gestion du filtre au clique des boutons

    const buttons = loadFilters.querySelectorAll("button");

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

  }

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
  // Récupération du token, et s'il est différent de null:
  // Ajout du bandeau noir, filtres cachés, ajout du bouton Modifier et logout
  // ==========================

  const token = localStorage.getItem("token")
  const loginLogout = document.getElementById("login")

  if (token) {
    let blackBanner = document.querySelector(".edition-mode")
    blackBanner.style.display = "flex";
    let filters = document.querySelector(".filters")
    filters.style.display = "none";
    let button = document.querySelector(".modifier")
    button.style.display = "flex";
    loginLogout.textContent = "logout"
    loginLogout.removeAttribute("href");
  }

  // Logout du SubmitEvent, on enlève le token
  loginLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";

  })

  // ==========================
  // Modale
  // on appelle seulement .modal car .modal-content est déjà à l'intérieur
  // ==========================

  const openModal = document.querySelector(".modifier button")

  openModal.addEventListener("click", () => {
    const modaleBackground = document.querySelector(".modal")
    modaleBackground.style.display = "block";
    // on appelle la fonction pour faire apparaitre les miniatures
    loadWorksGallery();
  })

  // Clique sur les croix pour fermer la modale et revenir à la 1ere vue.
  function resetToFirstView() {
    titreInput.value = "";
    categorySelect.value = "";
    imageInput.value = "";
    // showMiniature.innerHTML = "";  => pose problème d'affichage si on recharge la modale, à corriger prochainement

    document.querySelector(".modal-delete").style.display = "flex";
    document.querySelector(".modal-add").style.display = "none";
  }

  const closeButtons = document.querySelectorAll(".close");

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      resetToFirstView();
      const modaleBackground = document.querySelector(".modal")
      modaleBackground.style.display = "none";
    })
  })

  // Clique à l'éxtérieur de la modale pour la fermer et aussi revenir à la 1ere vue.
  const externalClick = document.querySelector(".modal")

  externalClick.addEventListener("click", () => {
    resetToFirstView();
    const modaleBackground = document.querySelector(".modal")
    modaleBackground.style.display = "none";
  })

  // Pour arrêter propagation de la règle à l'intérieur de la modale
  const internalClick = document.querySelector(".modal-content")

  internalClick.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Affichage des works miniature dans la modale; on fait la fonction et on l'appelle quand on
  // clique sur le bouton Modifier

  function loadWorksGallery() {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""; // vider la galerie avant d'ajouter les nouvelles images

    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = work.imageUrl;
      const trash = document.createElement("i")
      trash.classList.add("fa-solid", "fa-trash-can", "fa-xs")
      trash.dataset.id = work.id;

      figure.appendChild(image);
      figure.appendChild(trash);
      modalGallery.appendChild(figure);


      // Suppression d'un work
      trash.addEventListener("click", async (e) => {

        const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token },
        })

        if (response.ok) {
          await fetchWorks();
          await loadWorksGallery();
        }
      })
    }
  }


  // Clique "ajouter une photo" pour afficher la 2ème Vue
  const addPhoto = document.querySelector(".add-photo")

  addPhoto.addEventListener("click", () => {
    const modaleDelete = document.querySelector(".modal-delete")
    modaleDelete.style.display = "none";
    const modalAdd = document.querySelector(".modal-add")
    modalAdd.style.display = "flex";
  })


  // 2ème vue

  // Clique sur la flèche-gauche pour revenir à la 1ère Vue
  const arrowLeft = document.querySelector(".arrow-left")

  arrowLeft.addEventListener("click", () => {
    console.log("clic flèche gauche")
    const modaleAdd = document.querySelector(".modal-add")
    modaleAdd.style.display = "none";
    const modaleDelete = document.querySelector(".modal-delete")
    modaleDelete.style.display = "flex";
  })

  // Ajout d'un nouveau WORK
  const addButton = document.getElementById("add-button")
  const imageInput = document.getElementById("new-work")
  const showMiniature = document.querySelector(".image-add");

  addButton.addEventListener("click", () => {
    document.getElementById("error-img").innerHTML = "";
    imageInput.click()
  });

  imageInput.addEventListener("change", () => {
    const newWork = imageInput.files[0];
    document.getElementById("error-img").innerHTML = ""; // reset du message précédent

    if (!newWork) return; // sécurité si aucun fichier

    // Vérifie le format
    if (newWork.type !== "image/jpeg" && newWork.type !== "image/png") {
      document.getElementById("error-img").innerHTML =
        "L’image doit être au format JPG ou PNG et faire moins de 4 Mo.";
      imageInput.value = ""; // vide le champ
      return; // stop ici
    }

    // Vérifie la taille
    if (newWork.size > 4194304) {
      document.getElementById("error-img").innerHTML =
        "L’image doit être au format JPG ou PNG et faire moins de 4 Mo.";
      imageInput.value = ""; // vide le champ
      return; // stop ici
    }

    // Si tout est bon → aperçu
    const imageURL = URL.createObjectURL(newWork);
    const miniature = document.createElement("img");
    miniature.src = imageURL;

    showMiniature.innerHTML = "";
    showMiniature.appendChild(miniature);

    const icone = document.querySelectorAll(".fa-image, .add-button, .info-message");
    icone.forEach(element => (element.style.display = "none"));


    miniature.addEventListener("click", () => {
      document.getElementById("error-img").innerHTML = "";
      imageInput.value = ""; // réinitialise pour pouvoir choisir un autre fichier
      imageInput.click();    // rouvre le sélecteur de fichiers
    });
  });

  // Recupère les catégorier pour l'ajout d'une nouvelle photo dans la modale
  // La fonction fecth est déjà plus haut lors de la création des boutons Filtre dans la page d'accueil 

  function SelectCategorie() {
    const select = document.getElementById("category");
    select.innerHTML = "";
    const empty = document.createElement("option")
    empty.value = "";
    empty.hidden = true;
    empty.selected = true;
    select.appendChild(empty);

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const option = document.createElement("option")
      option.value = category.id
      option.textContent = category.name
      select.appendChild(option);
    }
  }

  // Vérification du formulaire avant envoi (bouton Valider en vert)
  // trim = enlève les espaces vides

  const titreInput = document.getElementById("titre");
  const categorySelect = document.getElementById("category");
  const confirmButton = document.querySelector(".confirm");

  function checkFormCompletion() {
    const titre = titreInput.value.trim();
    const category = categorySelect.value;
    const image = imageInput.files[0];

    if (titre.length >= 3 && category !== "" && image) {
      confirmButton.style.background = "#1D6154";
    } else {
      confirmButton.style.background = "#A7A7A7";
    }
  }

  // On écoute et teste chaque changement du formulaire:

  titreInput.addEventListener("input", checkFormCompletion);
  categorySelect.addEventListener("change", checkFormCompletion);
  imageInput.addEventListener("change", checkFormCompletion);


  // Validation du formulaire:

  const form = document.querySelector(".add-form");

  form.addEventListener("submit", async (e) => {
    const titre = titreInput.value.trim();
    const category = categorySelect.value;
    const image = imageInput.files[0];

    if (titre.length < 3 || category === "" || !image) {
      e.preventDefault(); // bloque l’envoi
      document.getElementById("error-img").innerText =
        "Veuillez remplir tous les champs avant de valider.";
    } else {
      // Envoi du nouveau work à l'API
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", titre);
      formData.append("category", category);
      formData.append("image", image);
      document.getElementById("error-img").innerText = "";
      for (let pair of formData.entries()) {
      }
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body: formData,
      });
      const data = await response.json()

      if (response.status === 201) {

        // Recharger les works
        await fetchWorks();

        // Fermer la modale proprement
        resetToFirstView();
        document.querySelector(".modal").style.display = "none";

      } else {
        document.getElementById("error-img").innerText = "Une erreur est survenue, veuillez réessayer.";
      }
    }

  });

})
