document.addEventListener('DOMContentLoaded', function() {
    // Header and Navigation Elements
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

    // Smooth Scroll for Down Button
    downButton.addEventListener('click', function() {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Clone and Append Navigation Links to Dropdown Menu
    navMenuLinks.forEach(link => {
        const clonedLink = link.cloneNode(true);
        const li = document.createElement('li');
        li.appendChild(clonedLink);
        dropdownMenu.appendChild(li);
    });

    // Scroll Event Listener
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

    // Smooth Scroll for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        dropdownMenu.classList.toggle('open');
    });

    // Smooth Scroll for Dropdown Menu Links
    dropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            dropdownMenu.classList.remove('open');
        });
    });

    // Carousel Functionality
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide img');
    const totalSlides = slides.length;

    function showSlide(index) {
        const carouselContainer = document.querySelector('.carousel-container');
        const offset = index * -100;
        carouselContainer.style.transform = `translateX(${offset}%)`;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Slider Functionality
    const sliderImages = document.querySelectorAll(".slider-img");

    function handleSliderClick(event) {
        sliderImages.forEach(function(img) {
            img.classList.remove("active");
        });
        event.currentTarget.classList.add("active");
    }

    function updateSliderBehavior() {
        const isMobile = window.innerWidth <= 768;
        sliderImages.forEach(function(sliderImg) {
            sliderImg.removeEventListener("click", handleSliderClick);
            if (!isMobile) {
                sliderImg.addEventListener("click", handleSliderClick);
            } else {
                sliderImg.classList.add("active"); // Ensure all slides are active in mobile view
            }
        });
    }

    window.addEventListener("resize", updateSliderBehavior);
    updateSliderBehavior(); // Initial check
});
