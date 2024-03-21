// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

//affichage des projets en images
function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) { 
        // Récupération de l'élément du DOM qui accueillera les projets
        const gallery = document.querySelector(".gallery")
    
        // Création d’une balise dédiée à un projet
        const figureProjet = document.createElement("figure")
    
        // création des balises
        const imageProjet = document.createElement("img")
        imageProjet.src = projets[i].imageUrl
        imageProjet.alt = projets[i].title
    
        const titreProjet = document.createElement("figcaption")
        titreProjet.innerText = projets[i].title
    
        gallery.appendChild(figureProjet)
        figureProjet.appendChild(imageProjet)
        figureProjet.appendChild(titreProjet)
    }
}

//affichage des filtres
function genererFiltres(projets) {
    const categorie = projets.map(projet => projet.category);
    for  (let i = projets.length - 1; i >= 0; i--) {
        // Récupération de l'élément du DOM qui accueillera les filtres
        const filtre = document.querySelector(".filtre")

        // Création d’un bouton dédié à un filtre
        const boutonFiltre = document.createElement("button")
        boutonFiltre.innerHTML = categorie[i].name

        if (categorie[i].id !== categorie[i-1].id) {
            filtre.appendChild(boutonFiltre)
        }     
    }
}

//appel des fonctions
genererProjets(projets)
genererFiltres(projets)



