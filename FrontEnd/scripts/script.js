    // Récupération des projets de l’architecte depuis l'API
    const reponse = await fetch('http://localhost:5678/api/works');
    const projets = await reponse.json();

    //affichage des projets en images
    for (let i = 0; i < projets.length; i++) {
        const figure = projets[i]

        // Récupération de l'élément du DOM qui accueillera les projets
        const gallery = document.querySelector(".gallery")

        // Création d’une balise dédiée à un projet
        const figureProjet = document.createElement("figure")
        // figureProjet.dataset.id = projets[i].id

        // création des balises
        const imageProjet = document.createElement("img")
        imageProjet.src = figure.imageUrl
        imageProjet.alt = figure.title

        const titreProjet = document.createElement("figcaption")
        titreProjet.innerText = figure.title

        gallery.appendChild(figureProjet)
        figureProjet.appendChild(imageProjet)
        figureProjet.appendChild(titreProjet)
    }