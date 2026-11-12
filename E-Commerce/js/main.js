// ======= CART SYSTEM =======
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;

// Elements
const cartItems = document.getElementById('cartItems');
const checkoutBtn = document.getElementById('checkoutBtn');
const totalPriceEl = document.getElementById('totalPrice');
const discountInput = document.getElementById('discountCode');
const applyDiscount = document.getElementById('applyDiscount');
const checkoutModal = document.getElementById('checkoutModal');
const modalCart = document.getElementById('modalCart');
const modalTotal = document.getElementById('modalTotal');
const modalDiscount = document.getElementById('modalDiscount');
const closeModal = document.getElementById('closeModal');

// ======= ADD TO CART =======
document.querySelectorAll('.add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    const productName = btn.parentElement.querySelector('h3').innerText;
    const productPrice = parseFloat(btn.parentElement.querySelector('p').innerText.replace('$', ''));

    const existing = cart.find(item => item.name === productName);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    alert(`${productName} added to cart!`);
  });
});

// ======= RENDER CART =======
function renderCart() {
  if (!cartItems) return; 
  cartItems.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = `<li class="text-gray-400 italic">Your cart is empty.</li>`;
    if (totalPriceEl) totalPriceEl.innerText = '0.00';
    return;
  }

  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = "flex justify-between items-center py-2 border-b";
    li.innerHTML = `
      <div>
        <span class="font-semibold text-gray-700">${item.name}</span>
        <span class="text-gray-500 text-sm ml-2">($${item.price} each)</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">Qty:</span>
        <input type="number" min="1" value="${item.quantity}" 
        class="w-16 text-center border rounded p-1" data-name="${item.name}">
      </div>`;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  if (totalPriceEl) {
    totalPriceEl.innerText = (total - discount).toFixed(2);
  }

  cartItems.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', function () {
      const item = cart.find(i => i.name === this.dataset.name);
      item.quantity = parseInt(this.value);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

// ======= DISCOUNT =======
if (applyDiscount) {
  applyDiscount.addEventListener('click', () => {
    const code = discountInput.value.trim().toUpperCase();
    if (code === "SAVE10") {
      discount = 10;
      alert("Discount Applied: $10 off");
      renderCart();
    } else {
      alert("Invalid discount code");
    }
  });
}

// ======= CHECKOUT =======
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (modalCart) {
      modalCart.innerHTML = '';
    }
    let total = 0;
    
    cart.forEach(item => {
      const tr = document.createElement('tr');
      // Ekhane fixed width class (w-[55%], w-[15%], w-[30%]) add kora hoyeche jate table na banke
      tr.innerHTML = `
        <td class="py-3 text-left w-[55%] break-words">${item.name}</td>
        <td class="py-3 text-center w-[15%] font-medium">${item.quantity}</td>
        <td class="py-3 text-right w-[30%] font-medium">$${(item.price * item.quantity).toFixed(2)}</td>
      `;
      modalCart.appendChild(tr);
      total += item.price * item.quantity;
    });

    if (modalDiscount) modalDiscount.innerText = discount.toFixed(2);
    if (modalTotal) modalTotal.innerText = (total - discount).toFixed(2);
    if (checkoutModal) checkoutModal.classList.remove('hidden');

    // Clear cart
    cart = [];
    discount = 0;
    if (discountInput) discountInput.value = '';
    localStorage.removeItem("cart");
    renderCart();
  });
}

// ======= CLOSE MODAL =======
if (closeModal) {
  closeModal.addEventListener('click', () => {
    if (checkoutModal) checkoutModal.classList.add('hidden');
  });
}

// ======= AUTH: Signup =======
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[username]) {
        alert('Username already exists!');
      } else {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';
      }
    } else {
      alert('Please fill all fields.');
    }
  });
}

// ======= AUTH: Login =======
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username] === password) {
      localStorage.setItem('isLoggedIn', 'true');
      alert('Successfully logged in!');
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password!');
    }
  });
}

// ======= INITIAL LOAD =======
renderCart();