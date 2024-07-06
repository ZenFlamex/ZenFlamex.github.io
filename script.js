document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.getElementById('hamburger');
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');
    document.querySelector('.nav-right').appendChild(dropdownMenu);

    const downButton = document.getElementById('down-button');
    const aboutSection = document.getElementById('about');

    downButton.addEventListener('click', function() {
        aboutSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    document.querySelectorAll('.nav-menu li a').forEach(link => {
        const clonedLink = link.cloneNode(true);
        const li = document.createElement('li');
        li.appendChild(clonedLink);
        dropdownMenu.appendChild(li);

    
    });

    function onScroll() {
        const scrollPos = window.scrollY;

        if (scrollPos > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        const scrollMiddle = scrollPos + window.innerHeight / 2;
        sections.forEach(section => {
            if (scrollMiddle >= section.offsetTop && scrollMiddle < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const sectionId = section.getAttribute('id');
                    const linkHref = link.getAttribute('href').substring(1);

                    if (sectionId !== 'home' && sectionId === linkHref) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); 

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    hamburger.addEventListener('click', () => {
        dropdownMenu.classList.toggle('open');
    });

    dropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            dropdownMenu.classList.remove('open');
        });
    });
});

