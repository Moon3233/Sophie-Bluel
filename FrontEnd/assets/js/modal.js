document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('edit-button');
    const modalGallery = document.getElementById('modal-gallery');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.getElementById('close-modal');
    const token = localStorage.getItem('token');

    // Lorsque le bouton "Modifier" est cliqué
    editButton.addEventListener('click', function () {
        // Ouvrir le modal
        editModal.style.display = 'flex';
        // Charger les travaux dans le modal
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                // Vider la galerie du modal avant d'ajouter les nouveaux travaux
                modalGallery.innerHTML = '';

                // Afficher les travaux dans le modal
                data.forEach(work => {
                    const figure = document.createElement('figure');
                    figure.style.position = 'relative'; // Position relative pour contenir l'icône de suppression

                    const img = document.createElement('img');
                    img.src = work.imageUrl;
                    img.alt = work.title;

                    // Créer l'icône de suppression
                    const deleteIcon = document.createElement('div');
                    deleteIcon.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none" style="cursor: pointer;">
                            <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
                        </svg>
                    `;

                    // Événement de clic pour supprimer l'image
                    deleteIcon.addEventListener('click', () => {
                        fetch(`http://localhost:5678/api/works/${work.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => {
                                if (response.ok) {
                                    // Supprimer l'élément du DOM
                                    figure.remove();
                                } else {
                                    console.error('Erreur lors de la suppression:', response.statusText);
                                }
                            })
                            .catch(error => console.error('Erreur réseau:', error));
                    });

                    figure.appendChild(img);
                    figure.appendChild(deleteIcon);
                    modalGallery.appendChild(figure);
                });
            })
            .catch(error => console.error('Error fetching works:', error));
    });

    // Fermer le modal lorsque la croix est cliquée
    closeModal.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    // Fermer le modal lorsqu'on clique à l'extérieur du contenu
    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});
