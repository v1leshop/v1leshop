const API = "http://localhost:3000/api";
const msg = document.getElementById("msg");

/* ================= LOGIN ================= */
async function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (!user || !pass) {
    msg.textContent = "Missing login fields";
    return;
  }

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password: pass })
  });

  const data = await res.json();
  if (!res.ok) {
    msg.textContent = data.error || "Login failed";
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));
  window.location.href = "products.html";
}

/* ================= SIGNUP ================= */
async function signup() {
  const username = document.getElementById("signupUser").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const telegram = document.getElementById("signupTelegram").value.trim();
  const password = document.getElementById("signupPass").value.trim();

  if (!username || !email || !telegram || !password) {
    msg.textContent = "Fill all signup fields";
    return;
  }

  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, telegram, password })
  });

  const data = await res.json();
  if (!res.ok) {
    msg.textContent = data.error || "Signup failed";
    return;
  }

  msg.textContent = "Account created. You can now login.";
}

/* ================= ADMIN KEY LOGIN ================= */
async function adminKeyLogin() {
  const key = document.getElementById("adminKey").value.trim();

  if (!key) {
    msg.textContent = "Enter admin key";
    return;
  }

  const res = await fetch(`${API}/admin-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key })
  });

  const data = await res.json();
  if (!res.ok) {
    msg.textContent = data.error || "Invalid admin key";
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));
  window.location.href = "dashboard.html";
}

/* ================= MAKE FUNCTIONS GLOBAL ================= */
window.login = login;
window.signup = signup;
window.adminKeyLogin = adminKeyLogin;
