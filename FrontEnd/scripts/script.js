    // Récupération des projets de l’architecte depuis l'API
    const reponse = await fetch('http://localhost:5678/api/works');
    const projets = await reponse.json();