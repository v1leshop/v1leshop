// === LOCAL STORAGE KEYS ===
const USERS_KEY = "v1leshopUsers";
const TOKENS_KEY = "v1leshopTokens";
const STORE_KEY = "v1leshopStore";
const PRODUCTS_KEY = "v1leshopProducts";

// === INIT DEFAULT DATA ===
if(!localStorage.getItem(USERS_KEY)){
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
}
if(!localStorage.getItem(TOKENS_KEY)){
  localStorage.setItem(TOKENS_KEY, JSON.stringify(["abc123","godmode"]));
}
if(!localStorage.getItem(PRODUCTS_KEY)){
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([
    {name:"God Complex", inStock:true},
    {name:"Killer Green Budz", inStock:true}
  ]));
}
if(!localStorage.getItem(STORE_KEY)){
  localStorage.setItem(STORE_KEY, JSON.stringify({open:true}));
}

// === AUTH FUNCTIONS ===
function signup(){
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const telegram = document.getElementById("signupTelegram").value.trim();
  const isAdmin = document.getElementById("isAdmin").checked;

  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  if(users.find(u=>u.username===username)){
    document.getElementById("authMsg").textContent="User exists!";
    return;
  }
  users.push({username,password,telegram,isAdmin});
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  document.getElementById("authMsg").textContent="Signup success!";
}

function login(){
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const telegram = document.getElementById("loginTelegram").value.trim();

  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  const user = users.find(u=>u.username===username && u.password===password && u.telegram===telegram);
  if(!user){ document.getElementById("authMsg").textContent="Login failed"; return; }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href="products.html";
}

function logout(){
  localStorage.removeItem("currentUser");
  window.location.href="index.html";
}

// === PRODUCT PAGE LOGIC ===
if(window.location.pathname.endsWith("products.html")){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user){ alert("Login required"); window.location.href="index.html"; }

  const store = JSON.parse(localStorage.getItem(STORE_KEY));
  if(!store.open){ alert("Store is closed"); window.location.href="index.html"; }

  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  const container = document.getElementById("productsList");
  container.innerHTML="";
  products.forEach(p=>{
    const div = document.createElement("div");
    div.textContent = `${p.name} - ${p.inStock ? "In Stock" : "Out of Stock"}`;
    container.appendChild(div);
  });

  // Show admin icon
  if(user.isAdmin){
    document.getElementById("adminIcon").style.display="inline";
    document.getElementById("adminIcon").onclick = ()=>window.location.href="dashboard.html";
  }
}

// === DASHBOARD LOGIC ===
if(window.location.pathname.endsWith("dashboard.html")){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user || !user.isAdmin){ alert("Access denied"); window.location.href="index.html"; }

  renderDashboard();
}

function renderDashboard(){
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  const container = document.getElementById("productToggles");
  container.innerHTML="";
  products.forEach((p,i)=>{
    const btn = document.createElement("button");
    btn.textContent = `${p.name} - ${p.inStock?"In Stock":"Out of Stock"}`;
    btn.onclick=()=>{
      products[i].inStock = !products[i].inStock;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      renderDashboard();
    };
    container.appendChild(btn);
  });

  const store = JSON.parse(localStorage.getItem(STORE_KEY));
  document.getElementById("storeStatus").textContent = store.open ? "Store is Open" : "Store is Closed";
}

function createToken(){
  const token = document.getElementById("newToken").value.trim();
  if(!token) return;
  const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY));
  tokens.push(token);
  localStorage.setItem(TOKENS_KEY,JSON.stringify(tokens));
  alert("Token added: "+token);
}

function toggleStore(){
  const store = JSON.parse(localStorage.getItem(STORE_KEY));
  store.open = !store.open;
  localStorage.setItem(STORE_KEY,JSON.stringify(store));
  renderDashboard();
}

// === EXPORT / IMPORT ===
function exportData(){
  const data = {
    users: JSON.parse(localStorage.getItem(USERS_KEY)),
    tokens: JSON.parse(localStorage.getItem(TOKENS_KEY)),
    products: JSON.parse(localStorage.getItem(PRODUCTS_KEY)),
    store: JSON.parse(localStorage.getItem(STORE_KEY))
  };
  const blob = new Blob([JSON.stringify(data, null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "v1leshop_data.json";
  a.click();
}

function importData(event){
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    const data = JSON.parse(e.target.result);
    localStorage.setItem(USERS_KEY,JSON.stringify(data.users||[]));
    localStorage.setItem(TOKENS_KEY,JSON.stringify(data.tokens||[]));
    localStorage.setItem(PRODUCTS_KEY,JSON.stringify(data.products||[]));
    localStorage.setItem(STORE_KEY,JSON.stringify(data.store||{open:true}));
    alert("Data imported!");
  };
  reader.readAsText(file);
}
