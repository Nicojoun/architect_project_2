// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

// Récupération des catégories depuis l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

//récupération du token
let token = window.localStorage.getItem("token")

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
    document.querySelector(".imagesProjets").innerHTML = ""
    genererImages(projets)
}
export { openModal };

//fermeture de la modale
const closeModal = function (e) {
    if (modal === null) return;
    if (modal.id === "modalForm") {
        const isClickInsideModal = modal.contains(e.target); // Vérifier si le clic se produit à l'intérieur de la modale
        if (isClickInsideModal) return; // Si le clic est à l'intérieur de la modale, ne pas fermer la modale
    }
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
}
export { closeModal };



//cliquer à l'intérieur de la modale ne la ferme pas
const stopPropagation = function (e) {
    e.stopPropagation()
}

//fermeture de la modale quand on appuie sur echap
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc" ) {
        closeModal(e)
    }
} )

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
export { genererImages };

// appel des fonctions de la modale

//ouverture de la modale des projets
document.getElementById("js-modal_1").addEventListener("click", openModal)

//ouverture de la modale du formulaire
document.getElementById("ajouterPhoto").addEventListener("click",openModal)

