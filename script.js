document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.getElementById('hamburger');
    const dropdownMenu = document.createElement('ul');
    const downButton = document.getElementById('down-button');
    const aboutSection = document.getElementById('about');
    const navRight = document.querySelector('.nav-right');
    const navMenuLinks = document.querySelectorAll('.nav-menu li a');

    dropdownMenu.classList.add('dropdown-menu');
    navRight.appendChild(dropdownMenu);

    downButton.addEventListener('click', function() {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });

    navMenuLinks.forEach(link => {
        const clonedLink = link.cloneNode(true);
        const li = document.createElement('li');
        li.appendChild(clonedLink);
        dropdownMenu.appendChild(li);
    });

    function onScroll() {
        const scrollPos = window.scrollY;
        header.classList.toggle('scrolled', scrollPos > 0);

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
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    hamburger.addEventListener('click', () => {
        dropdownMenu.classList.toggle('open');
    });

    dropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            dropdownMenu.classList.remove('open');
        });
    });
    

    // Carousel functionality
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide img');
    const totalSlides = slides.length;

    function showSlide(index) {
        const carouselContainer = document.querySelector('.carousel-container');
        const offset = index * -100;
        carouselContainer.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    function previousSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    }

    document.querySelector('.carousel-next').addEventListener('click', nextSlide);
    document.querySelector('.carousel-prev').addEventListener('click', previousSlide);

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
});
