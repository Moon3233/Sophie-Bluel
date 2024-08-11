document.addEventListener('DOMContentLoaded', function () {
    // Effectuer une requête GET à l'API pour obtenir les travaux
    fetch('http://localhost:5678/api/works')
        .then(response => response.json()) // Convertir la réponse en JSON
        .then(data => {
            const gallery = document.getElementById('gallery'); // Sélectionner l'élément de la galerie
            const categoryButtonsContainer = document.getElementById('category-buttons'); // Sélectionner le conteneur des boutons de catégorie

            // Créer un objet pour stocker les catégories uniques
            const categories = {};
            data.forEach(work => {
                // Ajouter chaque catégorie au tableau s'il n'est pas déjà présent
                if (!categories[work.category.id]) {
                    categories[work.category.id] = work.category.name;
                }
            });

            // Créer un bouton "Tous" pour afficher tous les travaux
            const allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => {
                displayWorks(data); // Afficher tous les travaux
                setActiveButton(allButton); // Définir le bouton "Tous" comme actif
            });
            categoryButtonsContainer.appendChild(allButton); // Ajouter le bouton "Tous" au conteneur

            // Créer des boutons pour chaque catégorie unique
            for (const [id, name] of Object.entries(categories)) {
                const button = document.createElement('button');
                button.textContent = name;
                button.dataset.categoryId = id;
                button.addEventListener('click', () => {
                    filterByCategory(id); // Filtrer les travaux par catégorie
                    setActiveButton(button); // Définir le bouton de la catégorie comme actif
                });
                categoryButtonsContainer.appendChild(button); // Ajouter le bouton de catégorie au conteneur
            }

            // Fonction pour définir le bouton actif
            function setActiveButton(button) {
                const buttons = categoryButtonsContainer.querySelectorAll('button'); // Sélectionner tous les boutons
                buttons.forEach(btn => btn.classList.remove('active')); // Retirer la classe 'active' de tous les boutons
                button.classList.add('active'); // Ajouter la classe 'active' au bouton cliqué
            }

            // Fonction pour filtrer les travaux par catégorie
            function filterByCategory(categoryId) {
                const filteredWorks = data.filter(work => work.categoryId == categoryId); // Filtrer les travaux par catégorie
                displayWorks(filteredWorks); // Afficher les travaux filtrés
            }

            // Afficher tous les travaux initialement
            displayWorks(data);
            setActiveButton(allButton); // Définir le bouton "Tous" comme actif initialement

            // Fonction pour afficher les travaux dans la galerie
            function displayWorks(works) {
                gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux travaux
                works.forEach(work => {
                    const figure = document.createElement('figure'); // Créer une figure pour chaque travail
                    const img = document.createElement('img'); // Créer une image pour chaque travail
                    img.src = work.imageUrl; // Définir la source de l'image
                    img.alt = work.title; // Définir le texte alternatif de l'image
                    const figcaption = document.createElement('figcaption'); // Créer une légende pour chaque travail
                    figcaption.textContent = work.title; // Définir le texte de la légende
                    figure.appendChild(img); // Ajouter l'image à la figure
                    figure.appendChild(figcaption); // Ajouter la légende à la figure
                    gallery.appendChild(figure); // Ajouter la figure à la galerie
                });
            }
        })
        .catch(error => console.error('Error fetching works:', error)); // Gérer les erreurs de la requête
});
