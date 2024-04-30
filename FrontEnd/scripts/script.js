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
let token = window.localStorage.getItem("token")
if (token !== null) {
    //déconnexion
    loginLogout.innerText = "logout"
    loginLogout.addEventListener("click", () => {
        window.localStorage.removeItem("token")
    }) 

    const modifierProjet = document.createElement("div")
    modifierProjet.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <a href="#modal1" id="js-modal_1" class="js-modal">Modifier</a>`
    mesProjets.appendChild(modifierProjet)
    edition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>Mode édition</p>`
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
            document.querySelector(".gallery").innerHTML = ""
            genererProjets(categoriesFiltrees)
            
        })
}
    //Réinitilisation des filtres et affichage de tous les projets
    const boutonTous = document.getElementById("tous")
    boutonTous.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = ""
        genererProjets(projets)
    })
}

//appel des fonctions
genererProjets(projets)
genererFiltres(categories)














//fenêtre modale

let modal = null;

const genererModale = (titre, content, footer) => {
    const html = `
        <div class="modal-wrapper js-modal-stop">
            <div class="header">
                <i class="fa-solid fa-xmark js-modal-close"></i>
                ${titre}
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                ${footer}
            </div>
        </div>`;
    return html;
}

const genereModaleProjets = () => {
    const titre = `<h1 id="titlemodal">Galerie photo</h1>`
    const content = `<div class="imagesProjets"></div>`
    const footer = `<button id="ajouterPhoto" class="boutonsFiltres">Ajouter une photo</button>`
    return genererModale(titre, content, footer)
}


const genererModaleUpload = () => {
    const titre = `<h1 id="titlemodal">Ajout photo</h1>`

    const content = `<form class="formPhoto">

                        <div>
                        <i class="fa-regular fa-image fa-2xl" style="color: #b9c5cc;" id="imageIcone"></i>
                            <label for="imageUploads" id="imageLabel">+ Ajouter photo</label>
                            <input type="file" id="imageUploads" name="image" accept="image/png, image/jpeg" />
                            <img  height="200" id="imageChoisie">
                            <p> jpg, png : 4mo max</p>
                        </div>

                        <label for="titre" id="labelTitre">Titre</label> </br></br>			
                        <input type="text" name="title" id="titre"> </br></br>

                        <label for="categorie" id="labelCategorie">Categorie</label> </br></br>
                        <select name="category" id="categorie">
                        </select>

                        <input type="submit" id="envoyerPhoto" value="Valider">

                        <p id="errorMessage" style="color: red;"></p>

                    </form >`

    const footer = ``

    return genererModale(titre, content, footer)
}

// Ouverture de la modale
const openModal = function (e) {
    e.preventDefault()
    const modalHtml = genereModaleProjets() // Générer le HTML de la modale
    document.getElementById("modal1").innerHTML = modalHtml
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    document.querySelector(".imagesProjets").innerHTML = ""
    genererImages(projets)
}

//fermeture de la modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

//cliquer à l'intérieur de la modale ne la ferme pas
const stopPropagation = function (e) {
    e.stopPropagation()
}

//Génération des images des projets dans la modale
const genererImages = function (images) {
    for (const image of images) { 
        // Récupération de l'élément du DOM qui accueillera les projets
        const imagesProjets = document.querySelector(".imagesProjets")

        // Création d’une balise dédiée à un projet
        const figureImage = document.createElement("figure")
    
        //création des balises des images
        const imageMiniature = document.createElement("img")
        imageMiniature.src = image.imageUrl
        imageMiniature.alt = image.title

        //création des balises des boutons
        const boutonSuppression = document.createElement("button")
        boutonSuppression.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>`

        imagesProjets.appendChild(figureImage)
        figureImage.appendChild(imageMiniature)
        figureImage.appendChild(boutonSuppression)

        // suppressionProjet(projets)
        const url = `http://localhost:5678/api/works/${image.id}`
        boutonSuppression.addEventListener("click", () => {
                fetch(url, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` },
                })

                //suppression du projet correspondant dans la zone "mes projets"
                .then(data => {
                    data.id = image.id
                    figureImage.remove()
                    document.getElementById("projet_" + data.id).remove()
                })

        })

    }
}

//création de la flèche retour
const header = document.querySelector(".header")
const flecheRetour = document.createElement("i")
flecheRetour.className = "fa-solid fa-arrow-left"
flecheRetour.id = "flecheRetour"
const modalWrapper = document.querySelector(".modal-wrapper") 

//gestion du bouton ajouter photo
const boutonAjouterPhoto = document.getElementById("ajouterPhoto")
const titlemodal = document.getElementById("titlemodal")
const content = document.querySelector(".content")

// Gestion de la flèche retour
flecheRetour.addEventListener("click", async () => {
    modalWrapper.innerHTML = `
        <div class="modal-wrapper js-modal-stop">
            <div class="header">
                <i class="fa-solid fa-xmark js-modal-close"></i>
                <h1 id="titlemodal">Galerie photo</h1>
            </div>
            <div class="content">
                <div class="imagesProjets"></div>
            </div>
            <div class="footer">
                <button id="ajouterPhoto" class="boutonsFiltres">Ajouter une photo</button>
            </div>
        </div>
     `

    // Récupération des projets de l’architecte depuis l'API
    const reponse_2 = await fetch('http://localhost:5678/api/works');
    const projets_2 = await reponse_2.json();

    // Récupération des images des projets pour les afficher dans la modale
    genererImages(projets_2)

    // Réattacher les événements nécessaires à la modale
    const boutonAjouterPhoto = document.getElementById("ajouterPhoto")
    boutonAjouterPhoto.addEventListener("click", modaleAjouterPhoto)
    closeModal()  // Si nécessaire pour réinitialiser les événements de fermeture de la modale
});


//ajouter des photos
const modaleAjouterPhoto = function () {

    //header.appendChild(flecheRetour)
    // content.innerHTML = ""
    // titlemodal.innerText = "Ajout photo"
    // boutonAjouterPhoto.remove()

    // openModaleFormulaire()

    const formCategorie = document.getElementById("categorie")
    categories.forEach(categorie => {
        const option = document.createElement("option")
        option.value = categorie.id
        option.textContent = categorie.name
        formCategorie.appendChild(option)
    })

    // //affichage de la photo à ajouter dans le formulaire de la modale
    const imageIcone = document.getElementById("imageIcone")
    const imageLabel = document.getElementById("imageLabel")
    const tailleMax = document.querySelector(".formPhoto p")
    const imageUploads = document.getElementById("imageUploads")
    const imageChoisie = document.getElementById("imageChoisie")
    const formPhotoDiv = document.querySelector(".formPhoto div")

    //affichage de l'image choisie dans le formaulaire de la modale
    imageUploads.addEventListener("input", (event) => {
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
    })
    
    //changement de couleur du bouton valider quand le formulaire de la modale est rempli
    const titre = document.getElementById("titre")
    const categorie = document.getElementById("categorie")
    const envoyerPhoto = document.getElementById("envoyerPhoto")

    // Écouteurs d'événements pour les changements de titre et de catégorie
    titre.addEventListener("input", () => {
        updateButtonColor()
    })
    
    categorie.addEventListener("input", () => {
        updateButtonColor()
    })
    
    // Fonction pour mettre à jour la couleur du bouton et gérer les erreurs
    const updateButtonColor = () => {
        const titreValue = titre.value.trim()
        const categorieValue = categorie.value.trim()
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
    // Envoi des données du formulaire
    const formPhoto = document.querySelector(".formPhoto")

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
    
}

// // appel des fonctions de la modale
// document.getElementById("js-modal_1").addEventListener("click", openModal)

// appel des fonctions de la modale
document.getElementById("js-modal_1").addEventListener("click", (e) => {
    openModal(e)

    const boutonAjouterPhoto = document.getElementById("ajouterPhoto")
    // Modification de la modale lorsque le bouton "Ajouter photo" est cliqué
    boutonAjouterPhoto.addEventListener("click", () => {
    // Génération de la modale d'upload
    const modalHtml = genererModaleUpload()
    
    // Remplacement du contenu de la modale par le nouveau HTML
    const modalContainer = document.getElementById("modal1")
    modalContainer.innerHTML = modalHtml

    // Appel de la fonction pour gérer la modale d'ajout de photo
    modaleAjouterPhoto()

    })
})

//fermeture de la modale quand on appuie sur echap
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc" ) {
        closeModal(e)
    }
} )