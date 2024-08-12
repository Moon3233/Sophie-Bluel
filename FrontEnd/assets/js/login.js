document.querySelector('#login form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre de manière traditionnelle

    // Récupérer les valeurs des champs du formulaire
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Sélectionner l'élément div pour afficher les erreurs
    const errorMessageDiv = document.querySelector('#error-message');
    errorMessageDiv.textContent = ''; // Réinitialiser le message d'erreur

    try {
        // Envoyer les données au serveur via une requête POST
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Traiter la réponse du serveur
        const data = await response.json();
        
        if (response.ok) {
            // Rediriger l'utilisateur et stocker le token dans le localStorage
            localStorage.setItem('token', data.token); // Stockage du token
            window.location.href = '/FrontEnd'; // Redirige vers la page d'accueil une fois la connexion réussie
        } else {
            // Afficher le message d'erreur dans le div
            errorMessageDiv.textContent = 'Identifiant et/ou mot de passe incorrect';
            // errorMessageDiv.textContent = data.message || 'Identifiant et/ou mot de passe incorrect';
        }
    } catch (error) {
        // Gérer les erreurs réseau ou autres et les afficher dans le div
        console.error('An error occurred:', error);
        errorMessageDiv.textContent = 'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer plus tard.';
    }
});
