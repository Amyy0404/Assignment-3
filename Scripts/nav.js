// Define the navigation links with display text and corresponding URLs
const navLinks = [
    { text: 'HOME', url: '../index.html' },
    { text: 'DESIGNS', url: '../Design/index.html', isDropdown: true }, // 'DESIGNS' links to Design page
    { text: 'THEORY', url: '../Theory/index.html' },
    { text: 'VISUALISATIONS', url: '../Visualisation/index.html' },
    { text: 'MEDIA', url: '../Content/index.html' }
];

// Sections for the dropdown under 'DESIGNS'
const designSections = [
    { text: 'WIREFRAMES', id: 'wireframes' },
    { text: 'STYLEGUIDE', id: 'styleguide' },
    { text: 'INSPIRATIONS', id: 'inspirations' },
    { text: 'UI ELEMENTS', id: 'elements' }
];

function createNavigationBar() {
    const navElement = document.querySelector('nav');
    if (!navElement) return;

    const navList = document.createElement('ul');
    const currentPath = window.location.pathname; // Get the full path of the current page

    navLinks.forEach(link => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = link.text;
        anchor.href = link.url;

        // Highlight active link based on current page
        if (currentPath.endsWith(link.url.split('/').pop())) {
            anchor.classList.add('active');
        }

        if (link.isDropdown) {
            // Only create dropdown if on Design/index.html page
            const dropdown = document.createElement('div');
            dropdown.classList.add('dropdown');
            dropdown.appendChild(anchor);

            // Add dropdown menu items only if on Design/index.html page
            if (currentPath.includes('/Design/index.html')) {
                const dropdownMenu = document.createElement('ul');
                designSections.forEach(section => {
                    const dropdownItem = document.createElement('li');
                    const dropdownLink = document.createElement('a');
                    dropdownLink.textContent = section.text;
                    dropdownLink.href = `#${section.id}`;
                    dropdownItem.appendChild(dropdownLink);
                    dropdownMenu.appendChild(dropdownItem);
                });
                dropdown.appendChild(dropdownMenu);
            }

            listItem.appendChild(dropdown);
        } else {
            listItem.appendChild(anchor);
        }

        navList.appendChild(listItem);
    });

    navElement.appendChild(navList); // Append the populated list to the <nav> element
}

document.addEventListener('DOMContentLoaded', createNavigationBar);
