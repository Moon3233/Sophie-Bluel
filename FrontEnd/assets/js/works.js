
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');
            const categoryButtonsContainer = document.getElementById('category-buttons');

            // Extract unique categories
            const categories = {};
            data.forEach(work => {
                if (!categories[work.category.id]) {
                    categories[work.category.id] = work.category.name;
                }
            });

            // Create buttons for categories
            for (const [id, name] of Object.entries(categories)) {
                const button = document.createElement('button');
                button.textContent = name;
                button.dataset.categoryId = id;
                button.addEventListener('click', () => filterByCategory(id));
                categoryButtonsContainer.appendChild(button);
            }

            // Function to filter works by category
            function filterByCategory(categoryId) {
                gallery.innerHTML = '';
                const filteredWorks = data.filter(work => work.categoryId == categoryId);
                displayWorks(filteredWorks);
            }

            // Display all works initially
            displayWorks(data);

            // Function to display works
            function displayWorks(works) {
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