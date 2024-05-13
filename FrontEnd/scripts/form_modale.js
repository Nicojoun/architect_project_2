//importation des fonctions
import { genererImages, openModal, closeModal } from './modale.js';

 
// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

// Récupération des catégories depuis l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

//récupération du token
let token = window.localStorage.getItem("token")

//récupération des éléments
const modalWrapper = document.querySelector(".modal-wrapper")
const imagesProjets = document.querySelector(".imagesProjets") 
const flecheRetour = document.getElementById("flecheRetour")
const formPhoto = document.querySelector(".formPhoto")
const imageIcone = document.getElementById("imageIcone")
const imageLabel = document.getElementById("imageLabel")
const tailleMax = document.querySelector(".formPhoto p")
const imageUploads = document.getElementById("imageUploads")
const imageChoisie = document.getElementById("imageChoisie")
const formPhotoDiv = document.querySelector(".formPhoto div")
const formCategorie = document.getElementById("categorie")
const titre = document.getElementById("titre")
const envoyerPhoto = document.getElementById("envoyerPhoto")

// Gestion de la flèche retour
const retourModale = async function(e) {
    closeModal("modalForm")
    openModal(e)
    imagesProjets.innerHTML = ""
    const reponse_2 = await fetch('http://localhost:5678/api/works');
    const projets_2 = await reponse_2.json();
    genererImages(projets_2)
}

//affichage de l'image choisie dans le formaulaire de la modale
const afficherImageChoisie = function(event) {
    const file = event.target.files[0] // Obtient le fichier sélectionné

    if (file) {
        const reader = new FileReader() // Crée un nouvel objet FileReader

        reader.addEventListener("load", () => {
        // Définit la source de l'image avec les données de l'image chargée
        imageChoisie.src = reader.result
        })

        // Lit le contenu du fichier en tant que Data URL
        reader.readAsDataURL(file)
    }

    imageIcone.remove()
    imageLabel.remove()
    tailleMax.remove()
    imageChoisie.style.maxHeight = `${formPhotoDiv.clientHeight}px`;
    updateButtonColor()
}


//gestion des catégories
categories.forEach(categorie => {
    const option = document.createElement("option")
    option.value = categorie.id
    option.textContent = categorie.name
    formCategorie.appendChild(option)
})

// Fonction pour mettre à jour la couleur du bouton et gérer les erreurs
const updateButtonColor = () => {
    const titreValue = titre.value.trim()
    const categorieValue = formCategorie.value.trim()
    const file = imageUploads.files[0]

    const errorMessage = document.getElementById("errorMessage")

    if (titreValue && categorieValue && file) {
        envoyerPhoto.style.backgroundColor = "#1D6154"
        envoyerPhoto.removeEventListener("click", erreurFormulaire)
        formPhoto.addEventListener("submit", validerFormulaire)
        errorMessage.innerText = "" // Effacer le message d'erreur
    } else {
        envoyerPhoto.style.backgroundColor = ""
        formPhoto.removeEventListener("submit", validerFormulaire)
        envoyerPhoto.addEventListener("click", erreurFormulaire)
    }
}

const erreurFormulaire = function() {
    errorMessage.innerText = "Veuillez remplir tous les champs pour continuer." // Afficher le message d'erreur
}

const validerFormulaire = async function(event) {
    event.preventDefault()

    //données à envoyer
    const formData = new FormData(formPhoto)

    //envoi des données à l'API
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        })

        if (response.ok) {
            console.log("Données envoyées avec succès !")

            // Récupérer les données du nouveau projet depuis la réponse
            const nouveauProjet = await response.json()

            // Générer et ajouter le nouvel élément HTML pour la zone "mes projet"
            const gallery = document.querySelector(".gallery")
            const figureProjet = document.createElement("figure")

            figureProjet.innerHTML = `  <img src="${nouveauProjet.imageUrl}" 
                                            alt="${nouveauProjet.title}">
                                        </img>
                                        <figcaption>${nouveauProjet.title}</figcaption>
            `
            gallery.append(figureProjet)
            
        } else {
            console.error("Erreur lors de l'envoi des données :", response.status)
        }

    } catch (error) {
        console.error("Erreur lors de la requête :", error.message)
    }

}





//appel des fonctions


//appel de la fonction de la flèche retour
flecheRetour.addEventListener("click", (e) => {
    retourModale(e)
})

// //fermeture de la modale quand on clique sur la croix
// document.querySelector(".fermerFormulaire").addEventListener("click", closeModal)

//fermeture de la modale quand on clique sur la croix
document.querySelector(".fermerFormulaire").addEventListener("click",() => {
    closeModal("modalForm")
    closeModal("modal1")
})


//affichage de l'image choisie
imageUploads.addEventListener("input",(event) => {
    afficherImageChoisie(event)
})

// Écouteurs d'événements pour les changements de titre et de catégorie
titre.addEventListener("input", () => {
    updateButtonColor()
})
    
formCategorie.addEventListener("input", () => {
    updateButtonColor()
})