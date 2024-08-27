document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    const editButton = document.getElementById('edit-button'); // Sélectionner le bouton Modifier

    // Vérifier si l'utilisateur est connecté en vérifiant si le token est présent dans le localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Si un token est présent, modifier le texte du lien en "logout"
        loginLink.textContent = 'logout';
        
        // Rendre le bouton Modifier visible
        if (editButton) {
            editButton.style.display = 'block';
        }

        // Ajoutez un événement de déconnexion lorsque l'utilisateur clique sur "logout"
        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // Empêcher le comportement par défaut (revenir à la page de login)

            // Supprimer le token du localStorage pour déconnecter l'utilisateur
            localStorage.removeItem('token');

            // Modifier le texte du lien en "login"
            loginLink.textContent = 'login';

            // Masquer le bouton Modifier après la déconnexion
            if (editButton) {
                editButton.style.display = 'none';
            }
            // Supprimer l'écouteur d'événement pour permettre le retour du comportement normal de "login"
            loginLink.removeEventListener('click', arguments.callee);
        });
    } else {
        // Si l'utilisateur n'est pas connecté, s'assurer que le lien affiche "login"
        loginLink.textContent = 'login';

        // Masquer le bouton Modifier
        if (editButton) {
            editButton.style.display = 'none';
        }
    }
});
