// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

// Récupération des catégories depuis l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

const loginLogout = document.getElementById("loginLogout")
const mesProjets = document.querySelector("#portfolio h2")
const edition = document.querySelector(".edition")

//modification de la page si la connection est réussie
let connecte = window.localStorage.getItem("connexion")
if (connecte !== null) {
    //déconnexion
    loginLogout.innerText = "logout"
    loginLogout.addEventListener("click", () => {
        window.localStorage.removeItem("connexion")
    }) 

    const modifierProjet = document.createElement("div")
    modifierProjet.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>modifier</p>`
    mesProjets.appendChild(modifierProjet)
    edition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>Mode édition</p>`
} 

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
        boutonFiltre.addEventListener("click", () => {
            const categoriesFiltrees = projets.filter(function (projet) {
                return projet.category.name === boutonFiltre.innerText
            })
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

//appel des fonctions
genererProjets(projets)
genererFiltres(categories)
