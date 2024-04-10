//connexion 
const formulaireConnexion = document.querySelector("form")
const spanMessageErreur = document.createElement("span")

formulaireConnexion.addEventListener("submit", async (event) => {
        
    event.preventDefault()
    // Création de l’objet de la connexion
    const login = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
        }
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login)
    // Appel de la fonction fetch avec toutes les informations nécessaires
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    })
    const connexion = await response.json();

    spanMessageErreur.innerHTML = ""
    //connexion réussie
    if (response.status === 200) {
        window.localStorage.setItem("connexion", connexion.token)
        document.location.href="index.html"; 
    } else  {
        //connexion échouée
        formulaireConnexion.appendChild(spanMessageErreur)
        const messageErreur = document.createElement("p")
        messageErreur.innerText = "Erreur dans l’identifiant ou le mot de passe"
        spanMessageErreur.appendChild(messageErreur)
    }  
        
})





