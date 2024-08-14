document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('edit-button');
    const modalGallery = document.getElementById('modal-gallery');
    const modalContent = document.getElementById('modal-content');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.getElementById('close-modal');
    const token = localStorage.getItem('token');
    const addPhotoButton = document.getElementById('add-photo-button');
    const addPhotoForm = document.getElementById('add-photo-form');
    const backToGallery = document.getElementById('back-to-gallery');
    const initialModalContent = document.getElementById('initial-modal-content');
    const messageContainer = document.getElementById('message-container');

    window.addEventListener('beforeunload', function(event) {
        console.log('La page est sur le point de se recharger.');
    });
    document.addEventListener('click', function(event) {
        console.log('Clic sur le document :', event.target);
    });

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
                    deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

                    // Événement de clic pour supprimer l'image
                    deleteIcon.addEventListener('click', (event) => {
                        console.log('Suppression d\'image : clic détecté');
                        
                        // Empêcher le rechargement de la page
                        event.preventDefault();
                        event.stopPropagation(); 
                        console.log('event.preventDefault() exécuté');

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

    addPhotoButton.addEventListener('click', function() {
        // Effacer tout le contenu du modal-content
        modalContent.innerHTML = '';
    
        // Afficher le formulaire pour ajouter une photo
        modalContent.appendChild(backToGallery);
        modalContent.appendChild(addPhotoForm);
        backToGallery.style.display = 'block';
        addPhotoForm.style.display = 'flex';
    });
    
    backToGallery.addEventListener('click', function() {
        // Effacer tout le contenu du modal-content
        modalContent.innerHTML = '';
    
        // Restaurer le contenu initial avec la galerie photo
        modalContent.appendChild(initialModalContent);
        initialModalContent.style.display = 'flex';
        backToGallery.style.display = 'none';
    });
    
    // Gestionnaire de soumission du formulaire
    addPhotoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation(); 
        
        const formData = new FormData(addPhotoForm);
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                // Afficher un message de succès
                messageContainer.textContent = 'Photo ajoutée avec succès !';
                messageContainer.style.color = 'green';
                messageContainer.style.display = 'block';
            } else {
                // Afficher un message d'erreur
                messageContainer.textContent = 'Erreur lors de l\'ajout de la photo.';
                messageContainer.style.color = 'red';
                messageContainer.style.display = 'block';
            }
        })
        .catch(error => console.error('Erreur réseau:', error));
    });

    // Pour afficher la photo choisie 
    document.getElementById('file-upload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.getElementById('photo-preview');

                 // Supprimer uniquement les éléments spécifiques (SVG, label, et paragraphe)
                const svg = photoPreview.querySelector('svg');
                const label = photoPreview.querySelector('label');
                const p = photoPreview.querySelector('p');

                if (svg) svg.remove();
                if (label) label.remove();
                if (p) p.remove();
                
                photoPreview.style.backgroundImage = `url(${e.target.result})`;
            }
            reader.readAsDataURL(file);
        
    });
    
    // Fonction pour charger les catégories
    function loadCategories() {
        const categorySelect = document.getElementById('category');
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(data => {
                // Effacer les options actuelles (au cas où)
                categorySelect.innerHTML = '';

                // Ajouter une option par défaut (facultatif)
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                categorySelect.appendChild(defaultOption);

                // Ajouter les catégories au menu déroulant
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
    }

    // Appeler la fonction pour charger les catégories lorsque le DOM est prêt
    loadCategories();

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
