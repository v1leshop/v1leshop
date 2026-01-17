const API = "";

const API = "http://localhost:3000/api";
let token = localStorage.getItem("token");

function setToken(t) {
  localStorage.setItem("token", t);
  location.href = "products.html";
}

// LOGIN
function login() {
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: loginUser.value,
      password: loginPass.value
    })
  })
    .then(r => r.json())
    .then(d => setToken(d.token));
}

// ADMIN KEY
function adminKeyLogin() {
  fetch(`${API}/admin-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: adminKeyInput.value })
  })
    .then(r => r.json())
    .then(d => setToken(d.token));
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
}

/* ===== PRODUCTS PAGE ===== */
if (location.pathname.endsWith("products.html")) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) location.href = "index.html";

  currentUserLabel.textContent = `👤 ${user.username}`;
  userLevel.textContent = `Level ${user.level} | XP ${user.xp}`;

  loadProducts();
  loadOrders();
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  productsList.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    const grams = document.createElement("input");
    grams.type = "number";
    grams.step = "0.5";
    grams.min = "2";

    const btn = document.createElement("button");
    btn.className = "neon-btn small";
    btn.textContent = "Buy";

    btn.onclick = async () => {
      if (!confirm("Confirm order?")) return;

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: JSON.parse(localStorage.user).id,
          product: p.name,
          grams: parseFloat(grams.value)
        })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Order placed");
      location.reload();
    };

    div.innerHTML = `<b>${p.name}</b> – $10/g`;
    div.appendChild(grams);
    div.appendChild(btn);
    productsList.appendChild(div);
  });
}

async function loadOrders() {
  const user = JSON.parse(localStorage.user);
  const res = await fetch(`/api/orders/${user.id}`);
  const orders = await res.json();

  lastOrders.innerHTML = "";
  orders.forEach(o => {
    const d = document.createElement("div");
    d.textContent = `${o.product} – ${o.grams}g – $${o.total} (${o.status})`;
    lastOrders.appendChild(d);
  });
}

