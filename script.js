// ================= STORAGE KEYS =================
const USERS_KEY = "v1leshopUsers";
const TOKENS_KEY = "v1leshopTokens";
const STORE_KEY = "v1leshopStore";
const PRODUCTS_KEY = "v1leshopProducts";
const ORDERS_KEY = "v1leshopOrders";

// ================= ADMIN ACCOUNT =================
const ADMIN_ACCOUNT = {
    username: "v1leshop",
    email: "v1le.shopsite@gmail.com",
    password: "Rhyco2121",
    telegram: "v1le shop",
    level: 99,
    xp: 0,
    isAdmin: true,
    private: false
};

// ================= INIT DATA =================
if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_ACCOUNT]));
}
if (!localStorage.getItem(TOKENS_KEY)) {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(["abc123", "godmode"]));
}
if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify([
        { name: "God Complex", inStock: true },
        { name: "Killer Green Budz", inStock: true }
    ]));
}
if (!localStorage.getItem(STORE_KEY)) {
    localStorage.setItem(STORE_KEY, JSON.stringify({ open: true }));
}
if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
}

// ================= SIGNUP =================
function signup() {
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const telegram = document.getElementById("signupTelegram").value.trim();
    const msg = document.getElementById("signupMsg");

    if (!username || !email || !password || !telegram) {
        msg.textContent = "All fields required";
        return;
    }

    if (username === "v1leshop" || email === "v1le.shopsite@gmail.com") {
        msg.textContent = "This account is reserved";
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (users.find(u => u.username === username || u.email === email)) {
        msg.textContent = "User already exists";
        return;
    }

    users.push({
        username,
        email,
        password,
        telegram,
        level: 1,
        xp: 0,
        isAdmin: false,
        private: false
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    msg.textContent = "Signup successful! You can now login.";
}

// ================= LOGIN =================
function login() {
    const userInput = document.getElementById("loginUserEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const telegram = document.getElementById("loginTelegram").value.trim();
    const msg = document.getElementById("loginMsg");

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(u =>
        (u.username === userInput || u.email === userInput) &&
        u.password === password &&
        u.telegram === telegram
    );

    if (!user) {
        msg.textContent = "Invalid login details";
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "products.html";
}

// ================= TOKEN ACCESS =================
function verifyToken() {
    const token = document.getElementById("tokenInput").value.trim();
    const msg = document.getElementById("tokenMsg");
    const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY));

    if (tokens.includes(token)) {
        localStorage.setItem("hasAccess", "true");
        window.location.href = "index.html";
    } else {
        msg.textContent = "Invalid token";
    }
}

// ================= ADMIN KEY LOGIN =================
function adminKeyLogin() {
    const key = document.getElementById("adminKeyInput").value.trim();
    const msg = document.getElementById("adminKeyMsg");

    if (key !== "V1LE-FARM-OWNER-1-ID-20092411") {
        msg.textContent = "Invalid admin key";
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const admin = users.find(u => u.isAdmin === true);

    localStorage.setItem("currentUser", JSON.stringify(admin));
    localStorage.setItem("hasAccess", "true");

    window.location.href = "dashboard.html";
}
