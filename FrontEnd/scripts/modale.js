// Récupération des projets de l’architecte depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

// Récupération des catégories depuis l'API
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

//récupération du token
let token = window.localStorage.getItem("token")

let modal = null;
const boutonModifier = document.getElementById("js-modal_1")

//génération de la base de la modale
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

//génération des projets de la modale
const modalProjets = () => {
    const titre = `<h1 id="titlemodal">Galerie photo</h1>`
    const content = `<div class="imagesProjets"></div>`
    const footer = `<button id="ajouterPhoto" class="boutonsFiltres" onclick="formModal()">Ajouter une photo</button>`
    return genererModale(titre, content, footer)
}

//génération du formulaire de la modale
const formModal = () => {
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

const back = (previousModalHtml) => {
    closeModal();
    // Open previous modal
}

const modalOpen = (modalHtml) => {
    closeModal();
    const target = document.getElementById("modal1");
    target.innerHTML = modalHtml;
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    document.querySelector(".imagesProjets").innerHTML = "";
    // genererImages(projets); // Il semble que genererImages ne soit pas défini dans ce code
}

const openModal = (currentHtml, previousHtml) => {
    closeModal();
    modalOpen(currentHtml);
    // Add close button and listener
    // Add back button and listener if necessary
    // Add buttons to the modal
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

        //suppression des projets
        boutonSuppression.addEventListener("click", () => {
            const url = `http://localhost:5678/api/works/${image.id}`

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

//gestion de l'ouverture de la modale
boutonModifier.addEventListener("click", () => {
    openModal(modalProjets())
    genererImages(projets)
})

// openModal(formModal(), modalProjets());