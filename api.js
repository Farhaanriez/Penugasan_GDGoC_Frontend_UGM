const API_BASE_URL = "https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1";

let currentPage = 1;
let currentFilters = {
  sort: "newest",
  genre: "",
  year: "",
  keyword: "",
};

async function getAllBooks(options = {}) {
  try {
    const {
      page = 1,
      sort = "newest",
      year = "",
      genre = "",
      keyword = "",
    } = options;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("sort", sort);
    if (year) params.append("year", year);
    if (genre) params.append("genre", genre);
    if (keyword) params.append("keyword", keyword);

    const url = `${API_BASE_URL}/book?${params.toString()}`;
    console.log("Fetching:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}

async function getBookById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/book/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Book Detail:", data);
    return data;
  } catch (error) {
    console.error("Error fetching book detail:", error);
    return null;
  }
}

async function getRandomBook(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append("year", filters.year);
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.keyword) params.append("keyword", filters.keyword);

    const url = `${API_BASE_URL}/random_book${
      params.toString() ? "?" + params.toString() : ""
    }`;
    console.log("Fetching random book:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Random Book:", data);
    return data;
  } catch (error) {
    console.error("Error fetching random book:", error);
    return null;
  }
}

async function getGenreStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/genre`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Genre Stats:", data);
    return data;
  } catch (error) {
    console.error("Error fetching genre stats:", error);
    return null;
  }
}

async function searchBooks(keyword) {
  return await getAllBooks({ keyword: keyword, page: 1 });
}

async function renderProductDetail(bookId) {
  const bookData = await getBookById(bookId);

  if (!bookData) {
    console.error("Failed to load book details");
    showError("product-detail", "Failed to load book details");
    return;
  }

  const book = bookData.book || bookData;
  console.log("Rendering book:", book);

  const titleElement = document.querySelector(".product-title");
  if (titleElement) titleElement.textContent = book.title || "Unknown Title";

  const priceElement = document.querySelector(".product-price");
  if (priceElement) {
    const price =
      book.price || book.details?.price || book.harga || "Contact for Price";

    let priceText = price;

    if (
      price &&
      typeof price === "string" &&
      price.includes("Rp") &&
      price !== "Rp 0"
    ) {
      const priceNumber = parseFloat(price.replace(/[^\d]/g, ""));

      if (!isNaN(priceNumber) && priceNumber > 0) {
        priceText = `Rp ${priceNumber.toLocaleString("id-ID")}`;
      }
    }

    priceElement.textContent = priceText;
  }

  const availabilityStatus = document.querySelector(".availability-status");
  if (availabilityStatus) {
    availabilityStatus.textContent = "In Stock";
    availabilityStatus.className = "availability-status in-stock";
  }

  const descElement = document.querySelector(".product-description");
  if (descElement) {
    descElement.textContent =
      book.synopsis ||
      book.summary ||
      book.description ||
      "No description available.";
  }

  const detailsContainer = document.querySelector(".product-details");
  if (detailsContainer) {
    const authorName = book.author?.name || book.author || "N/A";
    detailsContainer.innerHTML = `
            <p><strong>Pages:</strong> ${
              book.total_pages || book.pages || "N/A"
            }</p>
            <p><strong>Publisher:</strong> ${book.publisher || "N/A"}</p>
            <p><strong>ISBN:</strong> ${book.isbn || "N/A"}</p>
            <p><strong>Published:</strong> ${
              book.published_date || book.year || "N/A"
            }</p>
            <p><strong>Author:</strong> ${authorName}</p>
            ${
              book.format
                ? `<p><strong>Format:</strong> ${book.format}</p>`
                : ""
            }
            ${book.size ? `<p><strong>Size:</strong> ${book.size}</p>` : ""}
        `;
  }

  const productImage = document.getElementById("productImage");
  if (productImage) {
    const imageUrl = book.cover_image || book.image || "";
    if (imageUrl) {
      productImage.src = imageUrl;
      productImage.alt = book.title;
      productImage.onerror = function () {
        this.src =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23ddd" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
      };
    }
  }

  const tagsContainer = document.querySelector(".product-tags");
  if (tagsContainer) {
    tagsContainer.innerHTML = "";

    const categoryName = book.category?.name || book.category || "General";
    tagsContainer.innerHTML = `<span class="tag">${categoryName}</span>`;

    if (book.tags && Array.isArray(book.tags) && book.tags.length > 0) {
      const uniqueTags = [...new Set(book.tags.map((tag) => tag.name || tag))];
      uniqueTags.slice(0, 3).forEach((tagName) => {
        if (tagName && tagName !== categoryName) {
          tagsContainer.innerHTML += `<span class="tag">${tagName}</span>`;
        }
      });
    }
  }
}

function renderBookCard(book, cardType = "book") {
  const image = book.cover_image || book.image || book.coverImage;
  const displayImage =
    image ||
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="300"%3E%3Crect fill="%23e0e0e0" width="250" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3E' +
      encodeURIComponent(book.title?.substring(0, 20) || "No Image") +
      "%3C/text%3E%3C/svg%3E";

  const categoryName =
    book.category?.name || book.category || book.genre || "General";

  const price =
    book.price ||
    book.details?.price ||
    book.harga ||
    book.Price ||
    (book.buy_links && book.buy_links[0]?.price);

  let priceDisplay = price || "Contact for Price";
  let originalPriceDisplay = "";

  if (
    price &&
    typeof price === "string" &&
    price.includes("Rp") &&
    price !== "Rp 0"
  ) {
    try {
      const numericPrice = price.replace(/[^\d]/g, "");
      if (numericPrice && numericPrice !== "0") {
        const priceNum = parseInt(numericPrice);
        const originalPrice = Math.round(priceNum * 1.3);
        originalPriceDisplay = "Rp " + originalPrice.toLocaleString("id-ID");
        priceDisplay = "Rp " + priceNum.toLocaleString("id-ID");
      }
    } catch (e) {
      console.error("Error parsing price:", e);
    }
  }

  return `
        <div class="${cardType}-card" data-book-id="${book._id || book.id}">
            <div class="${cardType}-image">
                <img src="${displayImage}" 
                     alt="${book.title || "Unknown"}"
                     loading="lazy">
            </div>
            <div class="${cardType}-info">
                <h3 class="${cardType}-title">${
    book.title || "Unknown Title"
  }</h3>
                <p class="${cardType}-department">${categoryName}</p>
                <div class="${cardType}-pricing">
                    ${
                      originalPriceDisplay
                        ? `<span class="original-price">${originalPriceDisplay}</span>`
                        : ""
                    }
                    <span class="sale-price">${priceDisplay}</span>
                </div>
            </div>
        </div>
    `;
}

async function renderBooksForYou() {
  const booksGrid = document.getElementById("booksGrid");

  if (!booksGrid) {
    console.error("booksGrid element not found");
    return;
  }

  booksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="color: #666; margin-top: 15px;">Loading books...</p>
        </div>
    `;

  const response = await getAllBooks({
    page: 1,
    sort: currentFilters.sort,
    genre: currentFilters.genre,
  });

  if (!response || !response.books || response.books.length === 0) {
    booksGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: #666;">No books available</p>
            </div>
        `;
    return;
  }

  const books = response.books.slice(0, 8);
  booksGrid.innerHTML = books
    .map((book) => renderBookCard(book, "book"))
    .join("");

  booksGrid.querySelectorAll(".book-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const bookId = card.dataset.bookId;
      window.location.href = `?id=${bookId}`;
    });
  });
}

async function renderReadingList() {
  const readingGrid = document.getElementById("readingGrid");

  if (!readingGrid) {
    console.error("readingGrid element not found");
    return;
  }

  readingGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="color: #666; margin-top: 15px;">Loading reading list...</p>
        </div>
    `;

  const response = await getAllBooks({ page: 1, sort: "newest" });

  if (!response || !response.books || response.books.length === 0) {
    readingGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: #666;">No books available</p>
            </div>
        `;
    return;
  }

  const books = response.books.slice(0, 4);
  readingGrid.innerHTML = books
    .map((book) => renderBookCard(book, "reading"))
    .join("");

  readingGrid.querySelectorAll(".reading-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const bookId = card.dataset.bookId;
      window.location.href = `?id=${bookId}`;
    });
  });
}

function createFilterPanel() {
  const booksForYouSection = document.querySelector(".books-for-you");
  if (!booksForYouSection) return;

  if (document.getElementById("filterPanel")) return;

  const filterPanel = document.createElement("div");
  filterPanel.id = "filterPanel";
  filterPanel.className = "filter-panel";
  filterPanel.innerHTML = `
        <div class="filter-controls">
            <div class="filter-group">
                <label for="sortSelect">Sort by:</label>
                <select id="sortSelect" class="filter-select">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="titleAZ">Title (A-Z)</option>
                    <option value="titleZA">Title (Z-A)</option>
                    <option value="priceLowHigh">Price (Low to High)</option>
                    <option value="priceHighLow">Price (High to Low)</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="genreSelect">Genre:</label>
                <select id="genreSelect" class="filter-select">
                    <option value="">All Genres</option>
                </select>
            </div>
            
            <div class="filter-group">
                <button id="randomBookBtn" class="btn-random">
                    <i class="fas fa-random"></i> Random Book
                </button>
            </div>
        </div>
    `;

  booksForYouSection.insertBefore(filterPanel, booksForYouSection.firstChild);

  loadGenresForFilter();

  document
    .getElementById("sortSelect")
    .addEventListener("change", handleFilterChange);
  document
    .getElementById("genreSelect")
    .addEventListener("change", handleFilterChange);
  document
    .getElementById("randomBookBtn")
    .addEventListener("click", handleRandomBook);
}

async function loadGenresForFilter() {
  const genreSelect = document.getElementById("genreSelect");
  if (!genreSelect) return;

  const stats = await getGenreStats();
  if (!stats || !stats.genres) return;

  stats.genres.forEach((genreData) => {
    const option = document.createElement("option");
    option.value = genreData.genre || genreData._id;
    option.textContent = `${genreData.genre || genreData._id} (${
      genreData.count
    })`;
    genreSelect.appendChild(option);
  });
}

async function handleFilterChange() {
  const sortSelect = document.getElementById("sortSelect");
  const genreSelect = document.getElementById("genreSelect");

  currentFilters.sort = sortSelect.value;
  currentFilters.genre = genreSelect.value;
  currentPage = 1;

  await renderBooksForYou();
}

async function handleRandomBook() {
  const btn = document.getElementById("randomBookBtn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

  const randomBook = await getRandomBook(currentFilters);

  if (randomBook && randomBook._id) {
    window.location.href = `?id=${randomBook._id}`;
  } else {
    alert("Failed to get random book. Please try again.");
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-random"></i> Random Book';
  }
}

function setupSearch() {
  const searchIcons = document.querySelectorAll(
    ".nav-icons a:has(.fa-search), .mobile-nav-icons a:has(.fa-search)"
  );

  searchIcons.forEach((searchIcon) => {
    searchIcon.addEventListener("click", (e) => {
      e.preventDefault();

      const existingModal = document.querySelector(".search-modal");
      if (existingModal) existingModal.remove();

      const searchModal = document.createElement("div");
      searchModal.className = "search-modal";
      searchModal.innerHTML = `
                <div class="search-modal-content">
                    <button class="search-close">&times;</button>
                    <h2 style="margin-bottom: 20px;">Search Books</h2>
                    <input type="text" id="searchInput" placeholder="Type book title, author, or keyword..." autofocus>
                    <div id="searchResults"></div>
                </div>
            `;

      document.body.appendChild(searchModal);
      document.body.style.overflow = "hidden";

      searchModal
        .querySelector(".search-close")
        .addEventListener("click", () => {
          searchModal.remove();
          document.body.style.overflow = "auto";
        });

      searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) {
          searchModal.remove();
          document.body.style.overflow = "auto";
        }
      });

      const searchInput = document.getElementById("searchInput");
      let searchTimeout;

      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(async () => {
          const keyword = e.target.value.trim();
          const resultsContainer = document.getElementById("searchResults");

          if (keyword.length < 3) {
            resultsContainer.innerHTML =
              '<p style="text-align: center; color: #666; padding: 20px;">Type at least 3 characters to search</p>';
            return;
          }

          resultsContainer.innerHTML =
            '<p style="text-align: center; color: #666; padding: 20px;">Searching...</p>';

          const results = await searchBooks(keyword);

          if (!results || !results.books || results.books.length === 0) {
            resultsContainer.innerHTML =
              '<p style="text-align: center; color: #666; padding: 20px;">No books found</p>';
            return;
          }

          resultsContainer.innerHTML = results.books
            .slice(0, 10)
            .map((book) => {
              const image =
                book.cover_image ||
                book.image ||
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="80"%3E%3Crect fill="%23ddd" width="60" height="80"/%3E%3C/svg%3E';
              const authorName =
                book.author?.name || book.author || "Unknown Author";
              const categoryName =
                book.category?.name || book.category || "General";
              return `
                                <div class="search-result-item" data-book-id="${
                                  book._id || book.id
                                }">
                                    <img src="${image}" 
                                         alt="${book.title}"
                                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2280%22%3E%3Crect fill=%22%23ddd%22 width=%2260%22 height=%2280%22/%3E%3C/svg%3E'">
                                    <div>
                                        <h4>${book.title || "Unknown"}</h4>
                                        <p>${authorName} • ${categoryName}</p>
                                        <span class="price">${
                                          book.price || "Rp 0"
                                        }</span>
                                    </div>
                                </div>
                            `;
            })
            .join("");

          resultsContainer
            .querySelectorAll(".search-result-item")
            .forEach((item) => {
              item.addEventListener("click", () => {
                const bookId = item.dataset.bookId;
                window.location.href = `?id=${bookId}`;
              });
            });
        }, 500);
      });
    });
  });
}

function showError(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: #ff4444; font-size: 16px;">${message}</p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #1a7a6d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Initializing Bookstar API Integration...");

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (bookId && document.querySelector(".product-detail")) {
    console.log("Loading product detail for ID:", bookId);
    await renderProductDetail(bookId);
  }

  if (document.getElementById("booksGrid")) {
    console.log("Loading Books For You...");
    createFilterPanel();
    await renderBooksForYou();
  }

  if (document.getElementById("readingGrid")) {
    console.log("Loading Reading List...");
    await renderReadingList();
  }

  setupSearch();

  console.log("✅ API Integration loaded successfully!");
});
