// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

// Récupération des catégories depuis l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

function genererProjets(projets) {
    for (const projet of projets) { 
        // Récupération de l'élément du DOM qui accueillera les projets
        const gallery = document.querySelector(".gallery")
    
        // Création d’une balise dédiée à un projet
        const figureProjet = document.createElement("figure")
    
        // création des balises
        const imageProjet = document.createElement("img")
        imageProjet.src = projet.imageUrl
        imageProjet.alt = projet.title
    
        const titreProjet = document.createElement("figcaption")
        titreProjet.innerText = projet.title
    
        gallery.appendChild(figureProjet)
        figureProjet.appendChild(imageProjet)
        figureProjet.appendChild(titreProjet)
    }
}

//affichage des filtres
function genererFiltres(categories) {
    for  (const categorie of categories) {
        // Récupération de l'élément du DOM qui accueillera les filtres
        const filtre = document.querySelector(".filtre")

        // Création d’un bouton dédié à un filtre
        const boutonFiltre = document.createElement("button")
        boutonFiltre.innerText = categorie.name
        boutonFiltre.value = categorie.id
        boutonFiltre.className = "boutonsFiltres"   

        filtre.appendChild(boutonFiltre)

        // Tri des projets lorsqu'on clique sur les boutons des filtres
        boutonFiltre.addEventListener("click", (event) => {
            console.log(event.target.innerText + ": " + event.target.value)
            const categoriesFiltrees = projets.filter(function (projet) {
                return projet.category.name === boutonFiltre.innerText
            })
            console.log(categoriesFiltrees);
            document.querySelector(".gallery").innerHTML = "";
            genererProjets(categoriesFiltrees)
            
        })
}
    //Réinitilisation des filtres et affichage de tous les projets
    const boutonTous = document.getElementById("tous")
    boutonTous.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = "";
        genererProjets(projets)
    })
}

//connexion
const formulaireConnexion = document.querySelector("#connexion form")
formulaireConnexion.addEventListener("submit", (event) => {
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

//appel des fonctions
genererProjets(projets)
genererFiltres(categories)
