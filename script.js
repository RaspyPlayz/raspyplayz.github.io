// Change function name for the people lightbox
function openPersonLightbox(name, description) {
    document.getElementById('person-name').textContent = name;
    document.getElementById('person-description').textContent = description;
    document.getElementById('lightbox').style.display = 'flex';
}

function closePersonLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('close');
    const lightbox = document.getElementById('lightbox');
    
    closeButton.addEventListener('click', closePersonLightbox);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closePersonLightbox();
        }
    });
});



// tim lightbox
function openCustomLightbox(imageSrc) {
    const lightbox = document.getElementById('custom-lightbox');
    const lightboxImage = document.getElementById('custom-lightbox-image');
    lightboxImage.src = imageSrc;
    lightbox.style.display = 'flex';
}

// Function to close the lightbox
function closeCustomLightbox() {
    const lightbox = document.getElementById('custom-lightbox');
    lightbox.style.display = 'none';
}

// Event listener for closing the lightbox
document.getElementById('custom-close').addEventListener('click', closeCustomLightbox);

// Close lightbox when clicked outside the image
document.getElementById('custom-lightbox').addEventListener('click', function (e) {
    if (e.target === this) {
        closeCustomLightbox();
    }
});





// Select elements
const jeffImages = document.querySelectorAll('#jeffimg img');
const jeffView = document.getElementById('jeffview');
const imageViewerImg = document.getElementById('image-viewer-img');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

// Track the current image index
let currentIndex = 0;

// Function to update the lightbox image
function updateImage(index) {
    imageViewerImg.src = jeffImages[index].src;
}

// Function to open the lightbox
function openLightbox(index) {
    currentIndex = index;
    updateImage(currentIndex);
    jeffView.style.display = 'flex';  // Show the lightbox
}

// Function to close the lightbox
function closeLightbox() {
    jeffView.style.display = 'none'; // Hide the lightbox
}

// Event listeners for images to open the lightbox
jeffImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
});

// Event listeners for navigation buttons
prevButton.addEventListener('click', (e) => {
    currentIndex = (currentIndex - 1 + jeffImages.length) % jeffImages.length;
    updateImage(currentIndex);
});

nextButton.addEventListener('click', (e) => {
    currentIndex = (currentIndex + 1) % jeffImages.length;
    updateImage(currentIndex);
});

// Event listener to close the lightbox when clicking outside the image or buttons
jeffView.addEventListener('click', (e) => {
    // If the target is the lightbox background itself (not the image or buttons), close it
    if (e.target === jeffView) {
        closeLightbox();
    }
});

// Prevent the lightbox from closing when clicking on the image or navigation buttons
imageViewerImg.addEventListener('click', (e) => e.stopPropagation());
prevButton.addEventListener('click', (e) => e.stopPropagation());
nextButton.addEventListener('click', (e) => e.stopPropagation());
