// ==========================
// Séparer le code:
// script.js = front public
// login.js = authentification et gestion des accès
// ==========================

export function ajoutListenerLogin() {
    const form = document.getElementById('login-form');

    form.addEventListener("input", () => {
    document.getElementById("login-error").innerHTML = "";
    });

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        console.log("formulaire soumis !");

    // ==========================
    // Création de l'objet envoyé par le formulaire
    // ==========================

    const formLogin = {
        email : event.target.querySelector("[name=email]").value,
        password : event.target.querySelector("[name=password]").value
    };

    // ==========================
    // Création de la charge utile json
    // ==========================

    const chargeUtile = JSON.stringify(formLogin);

    // ==========================
    // Appel de la fonction fetch 
    // ==========================

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile,
    });

    const data = await response.json()

    if (response.status === 200) {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
    } else {
    document.getElementById("login-error").innerHTML = "Une erreur est survenue, veuillez réessayer.";
    }
    });
}

// ==========================
// On appelle la fonction:
// ==========================

ajoutListenerLogin();

