
document.addEventListener('DOMContentLoaded', function () {
    const portfolioLink = document.querySelector('nav ul li:nth-child(1)'); // Sélectionner l'élément 'projets'
    const contactLink = document.querySelector('nav ul li:nth-child(2)'); // Sélectionner l'élément 'contact'

    const portfolioSection = document.getElementById('portfolio'); // Section des projets
    const contactSection = document.getElementById('contact'); // Section contact

    // Ajouter l'événement de clic pour "projets"
    portfolioLink.addEventListener('click', function (event) {
        event.preventDefault(); // Empêche le comportement par défaut
        portfolioSection.scrollIntoView({ behavior: 'smooth' }); // Faire défiler vers la section des projets
    });

    // Ajouter l'événement de clic pour "contact"
    contactLink.addEventListener('click', function (event) {
        event.preventDefault(); // Empêche le comportement par défaut
        contactSection.scrollIntoView({ behavior: 'smooth' }); // Faire défiler vers la section contact
    });
});