const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileBreadcrumb = document.getElementById("mobileBreadcrumb");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  mobileBreadcrumb.classList.toggle("active");
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "auto";
});

const mobileLinks = document.querySelectorAll(
  ".mobile-nav-list a, .mobile-nav-icons a"
);
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    mobileBreadcrumb.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

const productImages = [
  "https://via.placeholder.com/400x500/4a90a4/ffffff?text=Book+Cover+1",
  "https://via.placeholder.com/400x500/6ba3b8/ffffff?text=Book+Cover+2",
  "https://via.placeholder.com/400x500/8fb6c6/ffffff?text=Book+Cover+3",
];

let currentImageIndex = 0;
const productImage = document.getElementById("productImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const wishlistBtn = document.getElementById("wishlistBtn");

prevBtn.addEventListener("click", () => {
  currentImageIndex =
    (currentImageIndex - 1 + productImages.length) % productImages.length;
  productImage.src = productImages[currentImageIndex];
});

nextBtn.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % productImages.length;
  productImage.src = productImages[currentImageIndex];
});

wishlistBtn.addEventListener("click", () => {
  wishlistBtn.classList.toggle("active");
  const icon = wishlistBtn.querySelector("i");
  if (wishlistBtn.classList.contains("active")) {
    icon.classList.remove("far");
    icon.classList.add("fas");
  } else {
    icon.classList.remove("fas");
    icon.classList.add("far");
  }
});

const readingGrid = document.getElementById("readingGrid");

if (readingGrid && window.innerWidth <= 768) {
  let isDown = false;
  let startX;
  let scrollLeft;

  readingGrid.addEventListener("mousedown", (e) => {
    isDown = true;
    readingGrid.style.cursor = "grabbing";
    startX = e.pageX - readingGrid.offsetLeft;
    scrollLeft = readingGrid.scrollLeft;
  });

  readingGrid.addEventListener("mouseleave", () => {
    isDown = false;
    readingGrid.style.cursor = "grab";
  });

  readingGrid.addEventListener("mouseup", () => {
    isDown = false;
    readingGrid.style.cursor = "grab";
  });

  readingGrid.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - readingGrid.offsetLeft;
    const walk = (x - startX) * 2;
    readingGrid.scrollLeft = scrollLeft - walk;
  });
}

const booksGrid = document.getElementById("booksGrid");

if (booksGrid && window.innerWidth <= 768) {
  let isDown = false;
  let startX;
  let scrollLeft;

  booksGrid.addEventListener("mousedown", (e) => {
    isDown = true;
    booksGrid.style.cursor = "grabbing";
    startX = e.pageX - booksGrid.offsetLeft;
    scrollLeft = booksGrid.scrollLeft;
  });

  booksGrid.addEventListener("mouseleave", () => {
    isDown = false;
    booksGrid.style.cursor = "grab";
  });

  booksGrid.addEventListener("mouseup", () => {
    isDown = false;
    booksGrid.style.cursor = "grab";
  });

  booksGrid.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - booksGrid.offsetLeft;
    const walk = (x - startX) * 2;
    booksGrid.scrollLeft = scrollLeft - walk;
  });
}
