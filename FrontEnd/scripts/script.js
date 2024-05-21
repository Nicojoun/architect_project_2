// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

// Récupération des catégories depuis l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

//récupération du token
let token = window.localStorage.getItem("token")

//récupération des éléments
const loginLogout = document.getElementById("loginLogout")
const mesProjets = document.querySelector("#portfolio h2")
const edition = document.querySelector(".edition")
const filtre = document.querySelector(".filtre")
const boutonTous = document.getElementById("tous")
const formContact = document.querySelector("#contact form")

//modification de la page si la connection est réussie
if (token !== null) {
    //déconnexion
    loginLogout.innerText = "logout"
    loginLogout.addEventListener("click", () => {
        window.localStorage.removeItem("token")
    }) 

    const modifierProjet = document.createElement("div")
    modifierProjet.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <a href="#modal1" id="js-modal_1" class="js-modal">modifier</a>`
    mesProjets.appendChild(modifierProjet)
    edition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>Mode édition</p>`
    edition.style.display = "flex"
    edition.style.marginBottom = "50px"
} 

const genererProjets = function (projets) {     
    for (const projet of projets) { 
        // Récupération de l'élément du DOM qui accueillera les projets
        const gallery = document.querySelector(".gallery")
    
        // Création d’une balise dédiée à un projet
        const figureProjet = document.createElement("figure")
        figureProjet.id = "projet_" + projet.id
    
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
const genererFiltres = function (categories) {     
    for  (const categorie of categories) {
        // Création d’un bouton dédié à un filtre
        const boutonFiltre = document.createElement("button")
        boutonFiltre.innerText = categorie.name
        boutonFiltre.value = categorie.id
        boutonFiltre.className = "boutonsFiltres"
        boutonFiltre.id = "boutonCategorie" + categorie.id   

        filtre.appendChild(boutonFiltre)

        boutonTous.classList.add("boutonClasseCiblee")

        // Tri des projets lorsqu'on clique sur les boutons des filtres
        boutonFiltre.addEventListener("click", (e) => {
            // Supprime la classe "boutonClasseCiblee" de tous les boutons de filtre
            document.querySelectorAll('.boutonsFiltres').forEach(button => {
                button.classList.remove('boutonClasseCiblee');
            });

            // Ajoute la classe "boutonClasseCiblee" au bouton sur lequel on a cliqué
            e.target.classList.add('boutonClasseCiblee');

            const categoriesFiltrees = projets.filter(function (projet) {
                return projet.category.name === boutonFiltre.innerText
            })

            document.querySelector(".gallery").innerHTML = ""
            genererProjets(categoriesFiltrees)
            
        })
    }

    //Réinitialisation des filtres et affichage de tous les projets
    boutonTous.addEventListener("click", () => {
        // Supprime la classe "boutonClasseCiblee" de tous les boutons de filtre
        document.querySelectorAll('.boutonsFiltres').forEach(button => {
            button.classList.remove('boutonClasseCiblee');
        });
        boutonTous.classList.add("boutonClasseCiblee")
        document.querySelector(".gallery").innerHTML = ""
        genererProjets(projets)
    })
}

if (token !== null) {
    boutonTous.style.opacity = 0
}


//appel des fonctions
genererProjets(projets)


if (token === null) {
    genererFiltres(categories)
}


//suppression du comportement par défault du formulaire de contact
formContact.addEventListener("submit", (e) => {
    e.preventDefault()
})











