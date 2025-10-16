// Séparer le code:
// → script.js = front public
// → login.js = authentification et gestion des accès

export function ajoutListenerLogin() {
    const form = document.getElementById('login-form');

form.addEventListener("submit", function(event) {
  event.preventDefault();
  console.log("formulaire soumis !");

// Création de l'objet envoyé par le formulaire
const formLogin = {
    email : event.target.querySelector("[name=email]").value,
    password : event.target.querySelector("[name=password]").value
};

// Création de la charge utile json
const chargeUtile = JSON.stringify(formLogin);

// Appel de la fonction fetch 
fetch("http://localhost:5678/api/users/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: chargeUtile,
    });
});
}

// On appelle la fonction:
ajoutListenerLogin();


