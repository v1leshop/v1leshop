const API = "";

/* ===== AUTH ===== */
async function login() {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: loginUser.value,
      password: loginPass.value
    })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  location.href = "products.html";
}

async function adminKeyLogin() {
  const res = await fetch("/api/admin-key", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: adminKeyInput.value })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  location.href = "products.html";
}

function logout() {
  localStorage.clear();
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

