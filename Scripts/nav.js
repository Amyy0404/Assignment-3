// Defining the navigation links with display text and corresponding URLs
const navLinks = [
    { text: 'HOME', url: '../index.html' }, 
    { text: 'DESIGNS', url: '../Design/index.html' },
    { text: 'THEORY', url: '../Theory/index.html' },
    { text: 'VISUALISATIONS', url: '../Visualisation/Index.html' },
    { text: 'MEDIA', url: '../Content/index.html' }
];

function createNavigationBar() {
    const navElement = document.querySelector('nav');
    if (!navElement) return; 

    const navList = document.createElement('ul'); 
    const currentPage = window.location.pathname.split("/").pop(); 

    navLinks.forEach(link => { 
        const listItem = document.createElement('li'); 
        const anchor = document.createElement('a'); 
        anchor.textContent = link.text; // Set the anchor's text to the corresponding link text
        anchor.href = link.url; 

        if (link.url.includes(currentPage)) { // Check if the link URL matches the current page
            anchor.classList.add('active'); 
        }

        listItem.appendChild(anchor); 
        navList.appendChild(listItem); 
    });

    navElement.appendChild(navList); // Finally, append the populated list to the <nav> element
}

document.addEventListener('DOMContentLoaded', createNavigationBar); 
