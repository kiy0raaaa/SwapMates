const storageKey = 'swapmates-market-v1';
const themeStorageKey = 'swapmates-theme';
const statusMessage = document.querySelector('#app-status');
let statusTimer;

const categoryNames = {
    books: 'Buku & Modul',
    electronics: 'Elektronik',
    dorm: 'Perlengkapan Kos',
    campus: 'Atribut Kampus'
};

const seedProducts = [
    {
        id: 'seed-calculator',
        name: 'Kalkulator saintifik Casio',
        category: 'campus',
        price: 75000,
        newPrice: 180000,
        condition: 95,
        location: 'Pogung',
        distance: 500,
        description: 'Kalkulator siap menemani kelas dan ujianmu. Semua tombol berfungsi dengan baik.',
        seller: 'Dita',
        course: "Ilmu Komputer '24",
        emoji: '🧮',
        visual: 'visual-calculator'
    },
    {
        id: 'seed-statistics',
        name: 'Buku pengantar statistika',
        category: 'books',
        price: 55000,
        newPrice: 100000,
        condition: 90,
        location: 'Karangmalang',
        distance: 800,
        description: 'Buku terawat, halaman bersih dan utuh. Cocok untuk menemani kuliah semester ini.',
        seller: 'Rian',
        course: "Ilmu Komputer '24",
        emoji: '📖',
        visual: 'visual-books'
    },
    {
        id: 'seed-desk-lamp',
        name: 'Lampu meja minimalis',
        category: 'dorm',
        price: 60000,
        newPrice: 100000,
        condition: 98,
        location: 'Sendowo',
        distance: 1000,
        description: 'Lampu meja ringkas untuk sesi belajar malam. Cahaya terang dan masih berfungsi baik.',
        seller: 'Naya',
        course: "Arsitektur '23",
        emoji: '💡',
        visual: 'visual-lamp'
    },
    {
        id: 'seed-wireless-mouse',
        name: 'Mouse wireless ergonomis',
        category: 'electronics',
        price: 50000,
        newPrice: 100000,
        condition: 92,
        location: 'Klebengan',
        distance: 1200,
        description: 'Mouse wireless nyaman untuk mengerjakan tugas, lengkap dengan receiver USB.',
        seller: 'Aldo',
        course: "Teknik Industri '24",
        emoji: '🖱️',
        visual: 'visual-mouse'
    },
    {
        id: 'seed-laptop-stand',
        name: 'Stand laptop lipat',
        category: 'electronics',
        price: 65000,
        newPrice: 120000,
        condition: 87,
        location: 'Pogung',
        distance: 650,
        description: 'Stand laptop aluminium ringan dan mudah dibawa. Sudutnya bisa diatur.',
        seller: 'Fara',
        course: "Manajemen '23",
        emoji: '💻',
        visual: 'visual-mouse'
    },
    {
        id: 'seed-folding-table',
        name: 'Meja lipat untuk kamar kos',
        category: 'dorm',
        price: 85000,
        newPrice: 140000,
        condition: 87,
        location: 'Klebengan',
        distance: 900,
        description: 'Meja lipat praktis untuk belajar atau makan. Kaki kokoh dan mudah disimpan.',
        seller: 'Bima',
        course: "Geografi '22",
        emoji: '🪑',
        visual: 'visual-lamp'
    },
    {
        id: 'seed-lab-coat',
        name: 'Jas lab putih ukuran M',
        category: 'campus',
        price: 65000,
        newPrice: 120000,
        condition: 82,
        location: 'Karangmalang',
        distance: 750,
        description: 'Jas lab bersih dan siap dipakai praktikum. Terdapat saku depan dan kancing lengkap.',
        seller: 'Siska',
        course: "Biologi '24",
        emoji: '🥼',
        visual: 'visual-books'
    }
];

const defaultState = () => ({
    products: [],
    wishlistIds: [],
    purchasedIds: [],
    soldIds: []
});

function announce(message) {
    if (statusMessage) {
        statusMessage.textContent = message;
        window.clearTimeout(statusTimer);
        statusTimer = window.setTimeout(() => {
            if (statusMessage.textContent === message) {
                statusMessage.textContent = '';
            }
        }, 5000);
    }
}

function loadState() {
    try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
            return defaultState();
        }

        const parsed = JSON.parse(stored);
        if (!parsed || !Array.isArray(parsed.products) ||
            !Array.isArray(parsed.wishlistIds) ||
            !Array.isArray(parsed.purchasedIds) ||
            !Array.isArray(parsed.soldIds)) {
            throw new Error('Format data SwapMates tidak valid.');
        }

        return parsed;
    } catch (error) {
        const reason = error instanceof Error ? error.message : 'penyebab tidak diketahui';
        announce(`Data browser tidak dapat dibaca (${reason}). Sesi ini memakai produk demo.`);
        return defaultState();
    }
}

let appState = loadState();
let activeProductId = '';
let chatProduct = null;
let wishlistOnly = false;
let selectedPhotoData = [];

const productGrid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#product-search');
const categoryFilter = document.querySelector('#filter-category');
const areaFilter = document.querySelector('#filter-area');
const conditionFilter = document.querySelector('#filter-condition');
const budgetFilter = document.querySelector('#filter-budget');
const budgetLabel = document.querySelector('#budget-label');
const resultCount = document.querySelector('#result-count');
const wishlistButton = document.querySelector('.wishlist-filter');
const productDialog = document.querySelector('#product-dialog');
const listingDialog = document.querySelector('#listing-dialog');
const trackerDialog = document.querySelector('#tracker-dialog');
const chatDialog = document.querySelector('#chat-dialog');
const listingForm = document.querySelector('#listing-form');

function saveState(nextState) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(nextState));
        appState = nextState;
        return true;
    } catch (error) {
        const reason = error instanceof Error ? error.message : 'penyebab tidak diketahui';
        announce(`Perubahan belum tersimpan di browser (${reason}). Coba kurangi ukuran foto atau ruang penyimpanan.`);
        return false;
    }
}

function formatCurrency(value) {
    return `Rp${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value)}`;
}

function discountFor(product) {
    const amount = Math.max(0, product.newPrice - product.price);
    const percentage = product.newPrice > 0 ? Math.floor((amount / product.newPrice) * 100) : 0;
    return { amount, percentage };
}

function allProducts() {
    return seedProducts.concat(appState.products);
}

function findProduct(productId) {
    return allProducts().find((product) => product.id === productId);
}

function productIsUnavailable(product) {
    return appState.purchasedIds.includes(product.id) || appState.soldIds.includes(product.id);
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function appendProductImage(container, product, imageIndex = 0) {
    const images = Array.isArray(product.images)
        ? product.images
        : (typeof product.imageData === 'string' ? [product.imageData] : []);
    const imageData = images[imageIndex];
    if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
        const image = createElement('img', 'product-photo');
        image.src = imageData;
        image.alt = product.name;
        container.append(image);
        return;
    }

    container.append(createElement('span', 'product-emoji', product.emoji || '📦'));
}

function createProductCard(product) {
    const card = createElement('article', 'product-card');
    const visualClass = product.visual || `visual-${product.category}`;
    const visual = createElement('div', `product-visual ${visualClass}`);
    const discount = discountFor(product);
    const discountBadge = createElement('span', 'discount-badge', `Hemat ${discount.percentage}%`);
    const wishlistToggle = createElement('button', 'wishlist-toggle', appState.wishlistIds.includes(product.id) ? '♥' : '♡');
    wishlistToggle.type = 'button';
    wishlistToggle.dataset.action = 'wishlist';
    wishlistToggle.dataset.productId = product.id;
    wishlistToggle.setAttribute('aria-pressed', String(appState.wishlistIds.includes(product.id)));
    wishlistToggle.setAttribute('aria-label', appState.wishlistIds.includes(product.id) ? 'Hapus dari daftar incaran' : 'Simpan ke daftar incaran');
    visual.append(discountBadge, wishlistToggle);
    appendProductImage(visual, product);
    visual.append(createElement('span', 'condition-badge', product.condition >= 95 ? `Like New · ${product.condition}%` : `Kondisi ${product.condition}%`));
    if (product.isOwn) {
        visual.append(createElement('span', 'owner-badge', 'Barang saya'));
    }

    const info = createElement('div', 'product-info');
    info.append(createElement('span', 'product-category', categoryNames[product.category] || 'Lainnya'));
    info.append(createElement('h3', '', product.name));

    const prices = createElement('div', 'product-price');
    prices.append(createElement('strong', '', formatCurrency(product.price)));
    const originalPrice = createElement('del', '', formatCurrency(product.newPrice));
    originalPrice.hidden = product.newPrice <= product.price;
    prices.append(originalPrice);
    info.append(prices);

    const location = createElement('p', 'product-location');
    location.append(createElement('span', '', '⌖'));
    location.append(document.createTextNode(`${product.location} · ±${product.distance >= 1000 ? `${(product.distance / 1000).toLocaleString('id-ID')} km` : `${product.distance} m`}`));
    info.append(location);

    const detailsButton = createElement('button', 'button button-product', 'Lihat detail');
    detailsButton.type = 'button';
    detailsButton.dataset.action = 'detail';
    detailsButton.dataset.productId = product.id;
    detailsButton.append(createElement('span', '', '↗'));
    info.append(detailsButton);

    card.append(visual, info);
    return card;
}

function getFilteredProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase('id-ID');
    const selectedCategory = categoryFilter.value;
    const selectedArea = areaFilter.value;
    const minimumCondition = conditionFilter.value === 'all' ? 0 : Number(conditionFilter.value);
    const maximumPrice = Number(budgetFilter.value);

    return allProducts().filter((product) => {
        if (productIsUnavailable(product)) {
            return false;
        }
        if (wishlistOnly && !appState.wishlistIds.includes(product.id)) {
            return false;
        }
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
            return false;
        }
        if (selectedArea !== 'all' && product.location !== selectedArea) {
            return false;
        }
        if (product.condition < minimumCondition || product.price > maximumPrice) {
            return false;
        }
        if (query) {
            const searchable = `${product.name} ${categoryNames[product.category] || ''} ${product.location} ${product.description}`.toLocaleLowerCase('id-ID');
            if (!searchable.includes(query)) {
                return false;
            }
        }
        return true;
    });
}

function renderProducts() {
    if (!productGrid) {
        return;
    }

    const filteredProducts = getFilteredProducts();
    productGrid.replaceChildren(...filteredProducts.map(createProductCard));
    emptyState.hidden = filteredProducts.length > 0;
    resultCount.textContent = `${filteredProducts.length} barang ditemukan${wishlistOnly ? ' dalam daftar incaran' : ''}`;
    budgetLabel.textContent = formatCurrency(Number(budgetFilter.value));
    if (wishlistOnly && appState.wishlistIds.length === 0) {
        emptyState.querySelector('p').textContent = 'Simpan barang dengan ikon hati untuk melihatnya di sini.';
    } else {
        emptyState.querySelector('p').textContent = 'Coba ubah kata kunci atau longgarkan filternya.';
    }
    wishlistButton.setAttribute('aria-pressed', String(wishlistOnly));
    wishlistButton.setAttribute('aria-label', wishlistOnly ? 'Tampilkan semua barang' : 'Tampilkan daftar incaran');
}

function updateTracker() {
    const products = allProducts();
    const purchasedProducts = appState.purchasedIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
    const soldProducts = appState.products.filter((product) => appState.soldIds.includes(product.id));
    const savedAmount = purchasedProducts.reduce((total, product) => total + Math.max(0, product.newPrice - product.price), 0);
    const incomeAmount = soldProducts.reduce((total, product) => total + product.price, 0);

    document.querySelector('#tracker-savings').textContent = formatCurrency(savedAmount);
    document.querySelector('#tracker-purchases').textContent = `${purchasedProducts.length} barang dibeli`;
    document.querySelector('#tracker-income').textContent = formatCurrency(incomeAmount);
    document.querySelector('#tracker-sales').textContent = `${soldProducts.length} barang terjual`;
    document.querySelector('#wishlist-count').textContent = String(appState.wishlistIds.length);
}

function render() {
    renderProducts();
    updateTracker();
}

function openDialog(dialog) {
    if (dialog && !dialog.open) {
        dialog.showModal();
    }
}

function closeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('#primary-menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu');
    menu.classList.remove('is-open');
}

function setTheme(theme, persist) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    const themeButton = document.querySelector('.theme-toggle');
    const isDark = nextTheme === 'dark';
    themeButton.textContent = isDark ? '☀' : '☾';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
    document.querySelector('meta[name="theme-color"]').content = isDark ? '#211d24' : '#fffaf2';

    if (persist) {
        try {
            localStorage.setItem(themeStorageKey, nextTheme);
        } catch (error) {
            const reason = error instanceof Error ? error.message : 'penyebab tidak diketahui';
            announce(`Tema berubah, tetapi preferensi belum tersimpan (${reason}).`);
        }
    }
}

document.querySelector('.menu-toggle').addEventListener('click', (event) => {
    const toggle = event.currentTarget;
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    toggle.setAttribute('aria-label', isExpanded ? 'Buka menu' : 'Tutup menu');
    document.querySelector('#primary-menu').classList.toggle('is-open', !isExpanded);
});

document.querySelector('#primary-menu').addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
        closeMobileMenu();
    }
});

document.querySelectorAll('[data-open-listing]').forEach((button) => {
    button.addEventListener('click', () => {
        closeMobileMenu();
        document.querySelector('#listing-feedback').textContent = '';
        openDialog(listingDialog);
    });
});

document.querySelector('[data-open-tracker]').addEventListener('click', () => {
    closeMobileMenu();
    updateTracker();
    openDialog(trackerDialog);
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog').close());
});

document.querySelector('.theme-toggle').addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, true);
});

wishlistButton.addEventListener('click', () => {
    wishlistOnly = !wishlistOnly;
    renderProducts();
    document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('[data-category-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        categoryFilter.value = link.dataset.categoryLink;
        wishlistOnly = false;
        renderProducts();
        document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    });
});

productGrid.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest('[data-action]');
    if (!button) {
        return;
    }

    const productId = button.dataset.productId;
    const product = findProduct(productId);
    if (!product) {
        announce('Barang tidak ditemukan. Muat ulang halaman lalu coba lagi.');
        return;
    }

    if (button.dataset.action === 'wishlist') {
        const wishlistIds = appState.wishlistIds.includes(productId)
            ? appState.wishlistIds.filter((id) => id !== productId)
            : [...appState.wishlistIds, productId];
        if (saveState({ ...appState, wishlistIds })) {
            render();
            announce(appState.wishlistIds.includes(productId) ? 'Barang ditambahkan ke daftar incaran.' : 'Barang dihapus dari daftar incaran.');
        }
        return;
    }

    showProductDetails(product);
});

function showProductDetails(product) {
    activeProductId = product.id;
    document.querySelector('#detail-category').textContent = categoryNames[product.category] || 'Lainnya';
    document.querySelector('#detail-title').textContent = product.name;
    document.querySelector('#detail-price').textContent = formatCurrency(product.price);
    const originalPrice = document.querySelector('#detail-new-price');
    originalPrice.textContent = formatCurrency(product.newPrice);
    originalPrice.hidden = product.newPrice <= product.price;

    const discount = discountFor(product);
    document.querySelector('#detail-savings').textContent = discount.amount > 0
        ? `Hemat ${discount.percentage}% · ${formatCurrency(discount.amount)} lebih murah dari harga baru`
        : 'Harga preloved pilihan mahasiswa.';
    document.querySelector('#detail-description').textContent = product.description;
    document.querySelector('#detail-condition').textContent = product.condition >= 95 ? `Like New · ${product.condition}%` : `Kondisi ${product.condition}%`;
    document.querySelector('#detail-location').textContent = `COD ${product.location} · ±${product.distance >= 1000 ? `${(product.distance / 1000).toLocaleString('id-ID')} km` : `${product.distance} m`}`;
    document.querySelector('#seller-name').textContent = product.seller;
    document.querySelector('#seller-course').textContent = product.course;
    document.querySelector('#seller-avatar').textContent = product.seller.slice(0, 1).toLocaleUpperCase('id-ID');

    const detailVisual = document.querySelector('#detail-visual');
    detailVisual.className = `detail-visual ${product.visual || `visual-${product.category}`}`;
    detailVisual.replaceChildren();
    appendProductImage(detailVisual, product);
    const thumbnails = document.querySelector('#detail-thumbnails');
    thumbnails.replaceChildren();
    const productImages = Array.isArray(product.images) ? product.images : [];
    productImages.forEach((imageData, index) => {
        const thumbnail = createElement('button', 'gallery-thumbnail');
        thumbnail.type = 'button';
        thumbnail.setAttribute('aria-label', `Lihat foto ${index + 1}`);
        thumbnail.setAttribute('aria-pressed', String(index === 0));
        const image = createElement('img');
        image.src = imageData;
        image.alt = '';
        thumbnail.append(image);
        thumbnail.addEventListener('click', () => {
            detailVisual.replaceChildren();
            appendProductImage(detailVisual, product, index);
            thumbnails.querySelectorAll('.gallery-thumbnail').forEach((item) => {
                item.setAttribute('aria-pressed', String(item === thumbnail));
            });
        });
        thumbnails.append(thumbnail);
    });
    const buyButton = document.querySelector('[data-detail-buy]');
    const soldButton = document.querySelector('[data-detail-sold]');
    buyButton.hidden = Boolean(product.isOwn);
    soldButton.hidden = !product.isOwn || productIsUnavailable(product);
    document.querySelectorAll('[data-offer]').forEach((offerButton) => {
        offerButton.disabled = Boolean(product.isOwn) || product.price <= Number(offerButton.dataset.offer);
    });
    openDialog(productDialog);
}

document.querySelector('[data-detail-chat]').addEventListener('click', () => {
    const product = findProduct(activeProductId);
    if (product) {
        openChat(product, `Halo, saya tertarik dengan ${product.name}. Apakah barangnya masih tersedia?`);
    }
});

document.querySelectorAll('[data-offer]').forEach((button) => {
    button.addEventListener('click', () => {
        const product = findProduct(activeProductId);
        if (!product || product.isOwn) {
            return;
        }
        const offerPrice = Math.max(1000, product.price - Number(button.dataset.offer));
        openChat(product, `Saya ingin menawar ${formatCurrency(offerPrice)} untuk ${product.name}. Apakah boleh?`);
    });
});

document.querySelector('[data-detail-buy]').addEventListener('click', () => {
    const product = findProduct(activeProductId);
    if (!product || product.isOwn || appState.purchasedIds.includes(product.id)) {
        announce('Barang ini tidak dapat dibeli dari akun demo ini.');
        return;
    }

    if (saveState({ ...appState, purchasedIds: [...appState.purchasedIds, product.id] })) {
        productDialog.close();
        render();
        announce(`Pembelian simulasi berhasil. Kamu menghemat ${formatCurrency(Math.max(0, product.newPrice - product.price))}.`);
    }
});

document.querySelector('[data-detail-sold]').addEventListener('click', () => {
    const product = findProduct(activeProductId);
    if (!product || !product.isOwn || appState.soldIds.includes(product.id)) {
        return;
    }

    if (saveState({ ...appState, soldIds: [...appState.soldIds, product.id] })) {
        productDialog.close();
        render();
        announce(`Barang ditandai terjual. ${formatCurrency(product.price)} tercatat sebagai pemasukan simulasi.`);
    }
});

function appendChatMessage(message, isMine) {
    const bubble = createElement('div', isMine ? 'chat-message is-mine' : 'chat-message', message);
    document.querySelector('#chat-log').append(bubble);
    bubble.scrollIntoView({ block: 'nearest' });
}

function openChat(product, firstMessage) {
    chatProduct = product;
    if (productDialog.open) {
        productDialog.close();
    }
    document.querySelector('#chat-title').textContent = `Chat dengan ${product.seller}`;
    document.querySelector('#chat-product').textContent = `${product.name} · ${formatCurrency(product.price)} · COD ${product.location}`;
    document.querySelector('#chat-log').replaceChildren();
    appendChatMessage(`Halo! Silakan tanya kondisi barang atau atur waktu COD untuk ${product.name}.`, false);
    if (firstMessage) {
        appendChatMessage(firstMessage, true);
    }
    openDialog(chatDialog);
    document.querySelector('#chat-message').focus();
}

document.querySelector('#chat-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#chat-message');
    const message = input.value.trim();
    if (!message || !chatProduct) {
        return;
    }

    appendChatMessage(message, true);
    input.value = '';
    window.setTimeout(() => {
        if (chatDialog.open) {
            appendChatMessage('Ini balasan otomatis demo. Silakan sepakati kondisi dan waktu COD langsung saat bertemu.', false);
        }
    }, 650);
});

const listingImageInput = document.querySelector('#listing-image');
const listingPreview = document.querySelector('#listing-preview');
const listingFeedback = document.querySelector('#listing-feedback');

listingImageInput.addEventListener('change', () => {
    const files = Array.from(listingImageInput.files);
    selectedPhotoData = [];
    listingPreview.hidden = true;
    listingFeedback.textContent = '';

    if (!files.length) {
        return;
    }
    if (files.length > 3) {
        listingFeedback.textContent = 'Pilih maksimal 3 foto barang.';
        listingImageInput.value = '';
        return;
    }
    if (files.some((file) => !file.type.startsWith('image/'))) {
        listingFeedback.textContent = 'Semua file harus berupa gambar dengan format yang didukung.';
        listingImageInput.value = '';
        return;
    }
    if (files.reduce((total, file) => total + file.size, 0) > 2 * 1024 * 1024) {
        listingFeedback.textContent = 'Total ukuran foto maksimal 2 MB agar bisa disimpan di browser.';
        listingImageInput.value = '';
        return;
    }

    Promise.all(files.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
                resolve(reader.result);
            } else {
                reject(new Error('Foto tidak dapat diproses.'));
            }
        };
        reader.onerror = () => reject(new Error('Foto gagal dibaca.'));
        reader.readAsDataURL(file);
    }))).then((images) => {
        selectedPhotoData = images;
        listingPreview.src = images[0];
        listingPreview.hidden = false;
    }).catch((error) => {
        const reason = error instanceof Error ? error.message : 'penyebab tidak diketahui';
        listingFeedback.textContent = `${reason} Coba pilih foto lain.`;
    });
});

function updateListingSavings() {
    const price = Number(document.querySelector('#listing-price').value);
    const newPrice = Number(document.querySelector('#listing-new-price').value);
    const output = document.querySelector('#listing-savings');
    if (!price || !newPrice) {
        output.textContent = 'Masukkan harga jual dan harga baru untuk melihat estimasi hemat.';
        return;
    }
    if (newPrice <= price) {
        output.textContent = 'Harga baru harus lebih tinggi dari harga jual.';
        return;
    }
    const amount = newPrice - price;
    const percentage = Math.floor((amount / newPrice) * 100);
    output.textContent = `Pembeli hemat ${percentage}% · ${formatCurrency(amount)} lebih murah`;
}

document.querySelector('#listing-price').addEventListener('input', updateListingSavings);
document.querySelector('#listing-new-price').addEventListener('input', updateListingSavings);

listingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    listingFeedback.textContent = '';
    if (!listingForm.reportValidity()) {
        return;
    }
    if (!selectedPhotoData.length) {
        listingFeedback.textContent = 'Tunggu sampai pratinjau foto selesai dimuat.';
        return;
    }

    const price = Number(document.querySelector('#listing-price').value);
    const newPrice = Number(document.querySelector('#listing-new-price').value);
    if (newPrice <= price) {
        listingFeedback.textContent = 'Estimasi harga baru harus lebih tinggi dari harga jual.';
        return;
    }

});

listingDialog.addEventListener('close', () => {
    listingFeedback.textContent = '';
});

document.querySelector('#filter-category').addEventListener('change', renderProducts);
document.querySelector('#filter-area').addEventListener('change', renderProducts);
document.querySelector('#filter-condition').addEventListener('change', renderProducts);
document.querySelector('#filter-budget').addEventListener('input', renderProducts);
document.querySelector('#product-search').addEventListener('input', renderProducts);

const pageQuery = new URLSearchParams(window.location.search);
const requestedCategory = pageQuery.get('kategori');
const requestedArea = pageQuery.get('area');

if (Array.from(categoryFilter.options).some((option) => option.value === requestedCategory)) {
    categoryFilter.value = requestedCategory;
}
if (Array.from(areaFilter.options).some((option) => option.value === requestedArea)) {
    areaFilter.value = requestedArea;
}

function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    areaFilter.value = 'all';
    conditionFilter.value = 'all';
    budgetFilter.value = budgetFilter.max;
    wishlistOnly = false;
    renderProducts();
}

document.querySelector('#reset-filters').addEventListener('click', resetFilters);
document.querySelector('#empty-reset').addEventListener('click', resetFilters);

let initialTheme = 'light';
try {
    initialTheme = localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
} catch (error) {
    const reason = error instanceof Error ? error.message : 'penyebab tidak diketahui';
    announce(`Preferensi tema tidak dapat dibaca (${reason}). Tema terang digunakan.`);
}
setTheme(initialTheme, false);
render();

if (pageQuery.get('jual') === '1') {
    openDialog(listingDialog);
}
