// Ensure lightboxes are hidden initially
window.onload = function() {
    document.getElementById('lightbox').style.display = 'none';
    document.getElementById('custom-lightbox').style.display = 'none';
    document.getElementById('jeff-lightbox').style.display = 'none';
    console.log("All lightboxes hidden on load");
};

// Person Lightbox
function openPersonLightbox(name, description) {
    console.log("Opening person lightbox for:", name);
    document.getElementById('person-name').textContent = name;
    document.getElementById('person-description').textContent = description;
    document.getElementById('lightbox').style.display = 'flex';
}

function closePersonLightbox() {
    console.log("Closing person lightbox");
    document.getElementById('lightbox').style.display = 'none';
}

document.getElementById('lightbox').addEventListener('click', function(event) {
    if (event.target === this || event.target.id === 'close') {
        closePersonLightbox();
    }
});

// Custom Lightbox (Tim's)
let customLightboxInterval;

function openCustomLightbox(imageSrc) {
    console.log("Opening custom lightbox with image:", imageSrc);
    const lightbox = document.getElementById('custom-lightbox');
    const lightboxImage = document.getElementById('custom-lightbox-image');
    const imageBoxes = Array.from(document.querySelectorAll('.image-box'));
    let currentIndex = imageBoxes.findIndex(box => box.querySelector('img').src.split('/').pop() === imageSrc.split('/').pop());

    lightboxImage.src = imageSrc;
    lightbox.style.display = 'flex';

    if (!document.getElementById('custom-prev')) {
        const prevButton = document.createElement('button');
        prevButton.id = 'custom-prev';
        prevButton.textContent = '<';
        prevButton.style.position = 'absolute';
        prevButton.style.left = '10px';
        prevButton.style.top = '50%';
        prevButton.style.transform = 'translateY(-50%)';
        lightbox.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.id = 'custom-next';
        nextButton.textContent = '>';
        nextButton.style.position = 'absolute';
        nextButton.style.right = '10px';
        nextButton.style.top = '50%';
        nextButton.style.transform = 'translateY(-50%)';
        lightbox.appendChild(nextButton);

        prevButton.addEventListener('click', (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex - 1 + imageBoxes.length) % imageBoxes.length;
            openCustomLightbox(imageBoxes[currentIndex].querySelector('img').src);
        });

        nextButton.addEventListener('click', (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex + 1) % imageBoxes.length;
            openCustomLightbox(imageBoxes[currentIndex].querySelector('img').src);
        });
    }
}

function closeCustomLightbox() {
    console.log("Closing custom lightbox");
    const lightbox = document.getElementById('custom-lightbox');
    lightbox.style.display = 'none';
    if (customLightboxInterval) {
        clearInterval(customLightboxInterval);
    }
}

document.getElementById('custom-close').addEventListener('click', closeCustomLightbox);

document.getElementById('custom-lightbox').addEventListener('click', function (e) {
    if (e.target === this) {
        closeCustomLightbox();
    }
});

const imageBoxes = Array.from(document.querySelectorAll('.image-box'));
imageBoxes.forEach(imageBox => {
    imageBox.addEventListener('click', function(event) {
        event.stopPropagation();
        openCustomLightbox(this.querySelector('img').src);
    });
});

// Jeff Lightbox
let currentIndexJeff = 0;

const imagesJeff = Array.from(document.querySelectorAll('#jeffimg img'));
const lightboxJeff = document.getElementById('jeff-lightbox');
const lightboxImageJeff = document.getElementById('jeff-lightbox-image');
const prevArrowJeff = document.getElementById('jeff-prev');
const nextArrowJeff = document.getElementById('jeff-next');

function openJeffLightbox(imageSrc) {
    console.log("Opening Jeff lightbox with image:", imageSrc);
    currentIndexJeff = imagesJeff.findIndex(img => img.src.split('/').pop() === imageSrc.split('/').pop());
    lightboxImageJeff.src = imageSrc;
    lightboxJeff.style.display = 'flex';
}

function closeJeffLightbox() {
    console.log("Closing Jeff lightbox");
    lightboxJeff.style.display = 'none';
}

function showPrevImageJeff() {
    currentIndexJeff = (currentIndexJeff - 1 + imagesJeff.length) % imagesJeff.length;
    lightboxImageJeff.src = imagesJeff[currentIndexJeff].src;
}

function showNextImageJeff() {
    currentIndexJeff = (currentIndexJeff + 1) % imagesJeff.length;
    lightboxImageJeff.src = imagesJeff[currentIndexJeff].src;
}

prevArrowJeff.addEventListener('click', function(event) {
    event.stopPropagation();
    showPrevImageJeff();
});

nextArrowJeff.addEventListener('click', function(event) {
    event.stopPropagation();
    showNextImageJeff();
});

document.getElementById('jeff-close').addEventListener('click', closeJeffLightbox);

lightboxJeff.addEventListener('click', function(event) {
    if (event.target === lightboxJeff) {
        closeJeffLightbox();
    }
});

const jeffImages = document.querySelectorAll('#jeffimg img');
jeffImages.forEach(img => {
    img.addEventListener('click', function(event) {
        event.stopPropagation();
        openJeffLightbox(this.src);
    });
});



// Get elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeStylesheet = document.getElementById('theme-stylesheet');

// Check if the light mode is set in localStorage
if(localStorage.getItem('theme') === 'light') {
    themeStylesheet.setAttribute('href', 'light.css');
    themeToggleBtn.textContent = 'Switch to Dark Mode';
}

// Button click to toggle between dark and light modes
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = themeStylesheet.getAttribute('href');

    if (currentTheme === 'styles.css') { // Currently in dark mode
        themeStylesheet.setAttribute('href', 'light.css');
        themeToggleBtn.textContent = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light');
    } else { // Currently in light mode
        themeStylesheet.setAttribute('href', 'styles.css');
        themeToggleBtn.textContent = 'Switch to Enzo Mode';
        localStorage.setItem('theme', 'dark');
    }
});
