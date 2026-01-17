// === STORAGE KEYS ===
const USERS_KEY = "v1leshopUsers";
const PRODUCTS_KEY = "v1leshopProducts";
const ORDERS_KEY = "v1leshopOrders";

// === ADMIN ACCOUNT ===
const ADMIN = {
  username: "v1leshop",
  email: "v1le.shopsite@gmail.com",
  password: "Rhyco2121",
  telegram: "v1le shop",
  level: 99,
  xp: 0,
  isAdmin: true,
  private: false
};

// === INIT ===
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN]));
}
if (!localStorage.getItem(PRODUCTS_KEY)) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([
    { name: "Killer Green Budz", price: 10, inStock: true },
    { name: "God Complex", price: 10, inStock: true }
  ]));
}
if (!localStorage.getItem(ORDERS_KEY)) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
}

// === AUTH ===
function login() {
  const u = loginUser.value.trim();
  const p = loginPass.value.trim();
  const users = JSON.parse(localStorage.getItem(USERS_KEY));

  const user = users.find(x =>
    (x.username === u || x.email === u) &&
    x.password === p
  );

  if (!user) {
    authMsg.textContent = "Invalid login";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "products.html";
}

function signup() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY));

  users.push({
    username: signupUser.value.trim(),
    email: signupEmail.value.trim(),
    telegram: signupTelegram.value.trim(),
    password: signupPass.value.trim(),
    level: 1,
    xp: 0,
    isAdmin: false,
    private: false
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  authMsg.textContent = "Account created";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// === PRODUCTS PAGE ===
if (location.pathname.endsWith("products.html")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) location.href = "index.html";

  currentUserLabel.textContent = `👤 ${currentUser.username}`;
  userLevel.textContent = `Level ${currentUser.level} | XP ${currentUser.xp}`;

  editEmail.value = currentUser.email;
  editTelegram.value = currentUser.telegram;

  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  productsList.innerHTML = "";

  products.forEach(p => {
    if (!p.inStock) return;

    const div = document.createElement("div");
    div.className = "product";

    const grams = document.createElement("input");
    grams.type = "number";
    grams.step = "0.5";
    grams.min = "2";

    const btn = document.createElement("button");
    btn.className = "neon-btn small";
    btn.textContent = "Buy";

    btn.onclick = () => {
      const g = parseFloat(grams.value);
      if (!g || g < 2) return alert("Min 2g");

      const total = g * 10;
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
      orders.push({ user: currentUser.username, product: p.name, grams: g, total });
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      currentUser.xp += total / 10;
      currentUser.level = Math.floor(currentUser.xp / 100) + 1;

      const users = JSON.parse(localStorage.getItem(USERS_KEY));
      users[users.findIndex(x => x.username === currentUser.username)] = currentUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      location.reload();
    };

    div.innerHTML = `<b>${p.name}</b><br>$10/g`;
    div.appendChild(grams);
    div.appendChild(btn);
    productsList.appendChild(div);
  });
}

// === ACCOUNT UPDATE ===
function updateAccount() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  currentUser.email = editEmail.value;
  currentUser.telegram = editTelegram.value;

  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  users[users.findIndex(x => x.username === currentUser.username)] = currentUser;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("Updated");
}

// === LEADERBOARD ===
function showLeaderboard() {
  leaderboardModal.style.display = "block";
  leaderboardList.innerHTML = "";

  const users = JSON.parse(localStorage.getItem(USERS_KEY))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);

  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u.private ? "Private User" : `${u.username} — XP ${u.xp}`;
    leaderboardList.appendChild(li);
  });
}
function closeLeaderboard() {
  leaderboardModal.style.display = "none";
}
