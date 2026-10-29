
const photos = [
  {
    title: "Into the Wild",
    category: "nature",
    description: "Where the mountains meet the sky",
    image: "photo-1464822759023-fed622ff2c3b"
  },
  {
    title: "Golden Hour",
    category: "nature",
    description: "Light painting the landscape",
    image: "photo-1470252649378-9c29740c9fa8"
  },
  {
    title: "Modern Geometry",
    category: "architecture",
    description: "Beauty in every line",
    image: "photo-1487958449943-2429e8be8625"
  },
  {
    title: "Ocean Dreams",
    category: "travel",
    description: "A little escape by the sea",
    image: "photo-1518837695005-2083093ee35b"
  },
  {
    title: "Silent Forest",
    category: "nature",
    description: "Find your own kind of quiet",
    image: "photo-1448375240586-882707db888b"
  },
  {
    title: "City Stories",
    category: "architecture",
    description: "The rhythm of urban life",
    image: "photo-1511818966892-d7d671e672a2"
  },
  {
    title: "Desert Bloom",
    category: "travel",
    description: "Endless horizons and warm tones",
    image: "photo-1509316785289-025f5b846b35"
  },
  {
    title: "Soft Forms",
    category: "abstract",
    description: "A study in color and texture",
    image: "photo-1550859492-d5da9d8e45f3"
  },
  {
    title: "Into the Blue",
    category: "travel",
    description: "Somewhere far from ordinary",
    image: "photo-1500530855697-b586d89ba3ee"
  },
  {
    title: "Wildflower",
    category: "nature",
    description: "Small wonders everywhere",
    image: "photo-1490750967868-88aa4486c946"
  },
  {
    title: "Urban Lines",
    category: "architecture",
    description: "Simplicity meets structure",
    image: "photo-1518005020951-eccb494ad742"
  },
  {
    title: "Color Theory",
    category: "abstract",
    description: "Unexpected shades and shapes",
    image: "photo-1541701494587-cb58502866ab"
  }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("largeImage");
const largeTitle = document.getElementById("largeTitle");
const largeCategory = document.getElementById("largeCategory");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

let filteredPhotos = [...photos];
let currentIndex = 0;
let lastFocused = null;

function imageURL(id, width = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

function renderGallery() {
  gallery.innerHTML = filteredPhotos.map((photo, index) => `
    <article class="photo" tabindex="0" role="button"
      aria-label="View ${photo.title}" data-index="${index}">
      <img src="${imageURL(photo.image)}"
        alt="${photo.title}" loading="lazy">
      <div class="view-icon" aria-hidden="true">↗</div>
      <div class="photo-info">
        <h3>${photo.title}</h3>
        <p>${photo.category.toUpperCase()} · 2026</p>
      </div>
    </article>
  `).join("");

  count.textContent = `${filteredPhotos.length} photographs`;
  empty.style.display = filteredPhotos.length ? "none" : "block";
}

// Category filtering
function filterPhotos(category) {
  filteredPhotos = category === "all"
    ? [...photos]
    : photos.filter(photo => photo.category === category);

  document.querySelectorAll(".filter-btn").forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active);
  });

  renderGallery();
}

document.querySelector(".filters").addEventListener("click", event => {
  const button = event.target.closest(".filter-btn");
  if (button) filterPhotos(button.dataset.filter);
});

// Open image using mouse or keyboard
gallery.addEventListener("click", event => {
  const card = event.target.closest(".photo");
  if (card) openLightbox(Number(card.dataset.index));
});

gallery.addEventListener("keydown", event => {
  const card = event.target.closest(".photo");

  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openLightbox(Number(card.dataset.index));
  }
});

// Lightbox functions
function openLightbox(index) {
  currentIndex = index;
  lastFocused = document.activeElement;

  updateLightbox();
  lightbox.classList.add("open");
  document.getElementById("close").focus();
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  const photo = filteredPhotos[currentIndex];
  if (!photo) return;

  largeImage.src = imageURL(photo.image, 1600);
  largeImage.alt = photo.title;
  largeTitle.textContent = photo.title;
  largeCategory.textContent =
    `${photo.category.toUpperCase()} — ${photo.description}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";

  if (lastFocused) lastFocused.focus();
}

function moveImage(direction) {
  if (!filteredPhotos.length) return;

  currentIndex =
    (currentIndex + direction + filteredPhotos.length)
    % filteredPhotos.length;

  updateLightbox();
}

document.getElementById("close")
  .addEventListener("click", closeLightbox);

document.getElementById("prev")
  .addEventListener("click", () => moveImage(-1));

document.getElementById("next")
  .addEventListener("click", () => moveImage(1));

// Close by clicking the dark background
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard controls
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveImage(-1);
  if (event.key === "ArrowRight") moveImage(1);
});

// Initial gallery
renderGallery();
