//connexion
export function connexion() {
    const formulaireConnexion = document.querySelector("form")
    formulaireConnexion.addEventListener("submit", (event) => {
        event.preventDefault()
        // Création de l’objet de la connexion
        const login = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        }
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login)
        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    })
}
connexion()