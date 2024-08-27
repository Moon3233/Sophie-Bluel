document.addEventListener("DOMContentLoaded", function () {
    const editButton = document.getElementById("edit-button");
    const modalGallery = document.getElementById("modal-gallery");
    const modalContent = document.getElementById("modal-content");
    const editModal = document.getElementById("edit-modal");
    const closeModal = document.getElementById("close-modal");
    const token = localStorage.getItem("token");
    const addPhotoButton = document.getElementById("add-photo-button");
    const addPhotoForm = document.getElementById("add-photo-form");
    const backToGallery = document.getElementById("back-to-gallery");
    const initialModalContent = document.getElementById(
        "initial-modal-content"
    );
    const messageContainer = document.getElementById("message-container");
    const messageContent = document.querySelector(".message-content");
    const submitButton = document.getElementById("submit-button");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const fileInput = document.getElementById("file-upload");
    const Gallery = document.getElementById("gallery");

    // Lorsque le bouton "Modifier" est cliqué
    editButton.addEventListener("click", function () {
        // Ouvrir le modal
        editModal.style.display = "flex";
        // Charger les travaux dans le modal
        fetch("http://localhost:5678/api/works")
            .then((response) => response.json())
            .then((data) => {
                // Vider la galerie du modal avant d'ajouter les nouveaux travaux
                modalGallery.innerHTML = "";

                // Afficher les travaux dans le modal
                data.forEach((work) => {
                    const figure = document.createElement("figure");
                    figure.style.position = "relative"; // Position relative pour contenir l'icône de suppression

                    const img = document.createElement("img");
                    img.src = work.imageUrl;
                    img.alt = work.title;

                    // Créer l'icône de suppression
                    const deleteIcon = document.createElement("div");
                    deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

                    // Événement de clic pour supprimer l'image
                    deleteIcon.addEventListener("click", (event) => {
                        console.log("Suppression d'image : clic détecté");

                        // Empêcher le rechargement de la page
                        event.preventDefault();

                        fetch(`http://localhost:5678/api/works/${work.id}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => {
                                if (response.ok) {
                                    // Supprimer l'élément du DOM
                                    figure.remove();
                                    // Supprimer l'élément correspondant dans la galerie principale
                                    const galleryFigure =
                                        document.getElementById(
                                            `figure-${work.id}`
                                        );
                                    if (galleryFigure) {
                                        galleryFigure.remove();
                                    }
                                } else {
                                    console.error(
                                        "Erreur lors de la suppression:",
                                        response.statusText
                                    );
                                }
                            })
                            .catch((error) =>
                                console.error("Erreur réseau:", error)
                            );
                    });

                    figure.appendChild(img);
                    figure.appendChild(deleteIcon);
                    modalGallery.appendChild(figure);
                });
            })
            .catch((error) => console.error("Error fetching works:", error));
    });

    addPhotoButton.addEventListener("click", function () {
        // Effacer tout le contenu du modal-content
        modalContent.innerHTML = "";

        // Afficher le formulaire pour ajouter une photo
        modalContent.appendChild(backToGallery);
        modalContent.appendChild(addPhotoForm);
        backToGallery.style.display = "block";
        addPhotoForm.style.display = "flex";
    });

    backToGallery.addEventListener("click", function () {
        // Effacer tout le contenu du modal-content
        modalContent.innerHTML = "";

        // Restaurer le contenu initial avec la galerie photo
        modalContent.appendChild(initialModalContent);
        initialModalContent.style.display = "flex";
        backToGallery.style.display = "none";
    });

    // Gestionnaire de soumission du formulaire
    addPhotoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(addPhotoForm);
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    // Ajouter un message de succès
                    messageContent.textContent = "Photo ajoutée avec succès !";
                    messageContent.classList.add("message-success");

                    // Ajouter dynamiquement l'image à la galerie principale
                    const figure = createFigure(
                        data.imageUrl,
                        data.title,
                        data.id
                    );
                    Gallery.appendChild(figure); // Ajout à la galerie principale

                    // Vider le formulaire
                    addPhotoForm.reset(); // Réinitialiser le formulaire

                    // Réinitialiser l'aperçu de l'image
                    const photoPreview =
                        document.getElementById("photo-preview");
                    photoPreview.style.backgroundImage = ""; // Supprimer l'image d'aperçu
                    photoPreview.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                        <path d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176 35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319 16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048 69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948 35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z" fill="#B9C5CC"/>
                    </svg>
                    <label for="file-upload" class="custom-file-upload">
                        + Ajouter photo
                    </label>
                    <input id="file-upload" type="file" name="image" accept="image/*" required/>
                    <p id="file-requirements">jpg, png : 4mo max</p>
                `;
                
                    // Fermer le modal après succès
                    setTimeout(() => {
                        editModal.style.display = "none";
                    }, 2000);
                } else {
                    // Ajouter un message d'erreur
                    messageContent.textContent =
                        "Erreur lors de l'ajout de la photo.";
                    messageContent.classList.add("message-error");
                }
                // Afficher le message
                messageContainer.style.display = "flex";

                // Masquer automatiquement le message après 2 secondes
                setTimeout(() => {
                    messageContainer.style.display = "none";
                }, 2000); // 2000 millisecondes = 2 secondes
            })
            .catch((error) => {
                console.error("Erreur réseau:", error);
                // Ajouter un message d'erreur
                messageContent.textContent =
                    "Erreur réseau lors de l'ajout de la photo.";
                messageContent.classList.add("message-error");

                // Afficher le message
                messageContainer.style.display = "flex";

                // Masquer automatiquement le message après 2 secondes
                setTimeout(() => {
                    messageContainer.style.display = "none";
                }, 2000); // 2000 millisecondes = 2 secondes
            });
    });

    // Fonction pour créer un élément figure pour l'image et l'ajouter à la galerie
    function createFigure(imageUrl, title, id) {
        const figure = document.createElement("figure");
        figure.setAttribute("id", `figure-${id}`); // Assigner un ID unique à chaque figure

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = title;

        // Ajouter les éléments enfants à la figure
        figure.appendChild(img);
        figure.appendChild(figcaption);

        return figure; // Retourner l'élément figure
    }

    // Pour afficher la photo choisie
    document
        .getElementById("file-upload")
        .addEventListener("change", function (event) {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = function (e) {
                const photoPreview = document.getElementById("photo-preview");

                // Supprimer uniquement les éléments spécifiques (SVG, label, et paragraphe)
                const svg = photoPreview.querySelector("svg");
                const label = photoPreview.querySelector("label");
                const p = photoPreview.querySelector("p");

                if (svg) svg.remove();
                if (label) label.remove();
                if (p) p.remove();

                photoPreview.style.backgroundImage = `url(${e.target.result})`;
            };
            reader.readAsDataURL(file);
        });

    // Fonction pour vérifier si tous les champs requis sont remplis
    function checkFormValidity() {
        if (
            titleInput.value.trim() !== "" &&
            categorySelect.value !== "" &&
            fileInput.files.length > 0
        ) {
            submitButton.disabled = false; // Activer le bouton
            submitButton.style.backgroundColor = "#1D6154"; // Ajouter la couleur de fond
            submitButton.style.border = "0.125rem solid #1D6154"; // Ajouter la bordure
            submitButton.style.color = "white"; // Assurez-vous que le texte soit visible sur le fond vert
        } else {
            submitButton.disabled = true; // Désactiver le bouton
            submitButton.style.backgroundColor = ""; // Réinitialiser la couleur de fond
            submitButton.style.border = ""; // Réinitialiser la bordure
            submitButton.style.color = ""; // Réinitialiser la couleur du texte
        }
    }

    // Ajouter des écouteurs d'événements sur les champs requis pour vérifier leur validité
    titleInput.addEventListener("input", checkFormValidity);
    categorySelect.addEventListener("change", checkFormValidity);
    fileInput.addEventListener("change", checkFormValidity);

    // Vérifiez l'état du formulaire lors du chargement initial
    checkFormValidity();

    // Fonction pour charger les catégories
    function loadCategories() {
        const categorySelect = document.getElementById("category");
        fetch("http://localhost:5678/api/categories")
            .then((response) => response.json())
            .then((data) => {
                // Effacer les options actuelles (au cas où)
                categorySelect.innerHTML = "";

                // Ajouter une option par défaut (facultatif)
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                categorySelect.appendChild(defaultOption);

                // Ajouter les catégories au menu déroulant
                data.forEach((category) => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch((error) =>
                console.error(
                    "Erreur lors de la récupération des catégories:",
                    error
                )
            );
    }

    // Appeler la fonction pour charger les catégories lorsque le DOM est prêt
    loadCategories();

    // Fermer le modal lorsque la croix est cliquée
    closeModal.addEventListener("click", function () {
        editModal.style.display = "none";
    });

    // Fermer le modal lorsqu'on clique à l'extérieur du contenu
    window.addEventListener("click", function (event) {
        if (event.target === editModal) {
            editModal.style.display = "none";
        }
    });
});
