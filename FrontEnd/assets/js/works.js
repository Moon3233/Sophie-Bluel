document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');
            const categoryButtonsContainer = document.getElementById('category-buttons');

            const categories = {};
            data.forEach(work => {
                if (!categories[work.category.id]) {
                    categories[work.category.id] = work.category.name;
                }
            });

            const allButton = document.createElement('button');
            allButton.textContent = 'Tous';
            allButton.addEventListener('click', () => {
                displayWorks(data);
                setActiveButton(allButton);
            });
            categoryButtonsContainer.appendChild(allButton);

            for (const [id, name] of Object.entries(categories)) {
                const button = document.createElement('button');
                button.textContent = name;
                button.dataset.categoryId = id;
                button.addEventListener('click', () => {
                    filterByCategory(id);
                    setActiveButton(button);
                });
                categoryButtonsContainer.appendChild(button);
            }

            function setActiveButton(button) {
                const buttons = categoryButtonsContainer.querySelectorAll('button');
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }

            function filterByCategory(categoryId) {
                const filteredWorks = data.filter(work => work.categoryId == categoryId);
                displayWorks(filteredWorks);
            }

            displayWorks(data);
            setActiveButton(allButton);

            function displayWorks(works) {
                gallery.innerHTML = '';
                works.forEach(work => {
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = work.imageUrl;
                    img.alt = work.title;
                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = work.title;
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                });
            }
        })
        .catch(error => console.error('Error fetching works:', error));
});
