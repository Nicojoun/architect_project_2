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
    modifierProjet.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <a href="#modal1" class="js-modal">Modifier</a>`
    mesProjets.appendChild(modifierProjet)
    edition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>Mode édition</p>`
} 

const genererProjets = function (projets) {     
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














//fenêtre modale

let modal = null

//ouverture de la modale
const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    target.style.display = null
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
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
        boutonSuppression.id = image.id

        imagesProjets.appendChild(figureImage)
        figureImage.appendChild(imageMiniature)
        figureImage.appendChild(boutonSuppression)

        // suppressionProjet(projets)
        const url = `http://localhost:5678/api/works/${image.id}`
        boutonSuppression.addEventListener("click", () => {
                fetch(url, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${connecte}` },
                })
                figureImage.remove()
                document.querySelector(".gallery figure").remove()
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

//ajouter des photos
const ModaleAjouterPhoto = function () {

    //gestion de la flèche retour
    flecheRetour.addEventListener("click", () => {
        location.reload()
    })

    //modification de la modale quand on clique sur le bouton ajouter photo
    boutonAjouterPhoto.addEventListener("click", () => {
        header.appendChild(flecheRetour)
        content.innerHTML = ""
        titlemodal.innerText = "Ajout photo"
        boutonAjouterPhoto.innerText = "Valider"
        boutonAjouterPhoto.style.backgroundColor = "#A7A7A7"
        boutonAjouterPhoto.style.padding = "5px 60px"
        content.innerHTML = `
            <form class="formPhoto" action="#" method="post">

                <div>
                <i class="fa-regular fa-image fa-2xl" style="color: #b9c5cc;" id="imageIcone"></i>
                    <label for="imageUploads" id="imageLabel">+ Ajouter photo</label>
                    <input type="file" id="imageUploads" name="imageUploads" accept="image/png, image/jpeg" />
                    <img src="" height="200" alt="image choisie" id="imageChoisie">
                    <p> jpg, png : 4mo max</p>
                </div>

                    <label for="titre" id="labelTitre">Titre</label> </br></br>			
                    <input type="text" name="titre" id="titre"> </br></br>

                    <label for="categorie" id="labelCategorie">Categorie</label> </br></br>
                    <input type="select" name="categorie" id="categorie">

                    <input type="submit" id="envoyerPhoto">

            </form >
        `
    })

    //affichage de la photo à ajouter dans le formulaire de la modale
    const imageUploads = document.getElementById("imageUploads")
    const imageChoisie = document.getElementById("imageChoisie")
    const file = imageUploads.files[0]
    const reader = new FileReader()

    imageUploads.addEventListener("change", () => {
        reader.addEventListener("load", () => {
            imageChoisie.src = reader.result
        },
        false,
        )

        if (file) {
            reader.readAsDataURL(file)
        }
    }) 

    const formPhoto = document.querySelector(".formPhoto")
    formPhoto.addEventListener("submit",(event) => {
        event.preventDefault()
    })
    
}

// appel des fonctions de la modale
document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
    genererImages(projets)
})
ModaleAjouterPhoto()

//fermeture de la modale quand on appuie sur echap
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc" ) {
        closeModal(e)
    }
} )