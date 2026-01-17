// === LOCAL STORAGE KEYS ===
const USERS_KEY = "v1leshopUsers";
const TOKENS_KEY = "v1leshopTokens";
const STORE_KEY = "v1leshopStore";
const PRODUCTS_KEY = "v1leshopProducts";

// === ADMIN CONFIG ===
const ADMIN_EMAILS = ["v1le.shopsite@gmail.com"];

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

// === TOKEN PAGE LOGIC ===
function verifyToken(){
  const token = document.getElementById("tokenInput").value.trim();
  const validTokens = JSON.parse(localStorage.getItem(TOKENS_KEY));
  if(validTokens.includes(token)){
    localStorage.setItem("hasAccess", "true");
    window.location.href="products.html";
  } else {
    document.getElementById("tokenMsg").textContent = "Invalid token!";
  }
}

// Redirect users to token page if they haven't entered a valid token
if(window.location.pathname.endsWith("products.html")){
  if(localStorage.getItem("hasAccess") !== "true"){
    window.location.href="token.html";
  }
}

// === AUTH FUNCTIONS ===
function signup(){
  const u=document.getElementById("signupUsername").value.trim();
  const p=document.getElementById("signupPassword").value.trim();
  const t=document.getElementById("signupTelegram").value.trim();
  const a=document.getElementById("isAdmin").checked;
  const users=JSON.parse(localStorage.getItem(USERS_KEY));
  if(users.find(x=>x.username===u)){
    document.getElementById("authMsg").textContent="User exists!";
    return;
  }
  users.push({username:u,password:p,telegram:t,isAdmin:a});
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
  document.getElementById("authMsg").textContent="Signup success!";
}

function login(){
  const u=document.getElementById("loginUsername").value.trim();
  const p=document.getElementById("loginPassword").value.trim();
  const t=document.getElementById("loginTelegram").value.trim();
  const users=JSON.parse(localStorage.getItem(USERS_KEY));
  const user=users.find(x=>x.username===u&&x.password===p&&x.telegram===t);
  if(!user){ document.getElementById("authMsg").textContent="Login failed"; return; }
  localStorage.setItem("currentUser",JSON.stringify(user));
  window.location.href="products.html";
}

function logout(){
  localStorage.removeItem("currentUser");
  window.location.href="index.html";
}

// === PRODUCT PAGE LOGIC with Gram Selector + Token Check ===
if(window.location.pathname.endsWith("products.html")){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user){ alert("Login required"); window.location.href="index.html"; }

  const store = JSON.parse(localStorage.getItem(STORE_KEY));
  if(!store.open){ alert("Store is closed"); window.location.href="index.html"; }

  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  const container = document.getElementById("productsList");
  container.innerHTML="";

  products.forEach((p,i)=>{
    const div = document.createElement("div");
    if(!p.inStock){ div.textContent = `${p.name} - Out of Stock`; container.appendChild(div); return; }

    const title = document.createElement("div");
    title.textContent = p.name;
    div.appendChild(title);

    const gramInput = document.createElement("input");
    gramInput.type = "number";
    gramInput.step = "0.5";
    gramInput.min = "0.5";
    gramInput.placeholder = "Enter grams (min 2g / $20)";
    div.appendChild(gramInput);

    const priceDisplay = document.createElement("div");
    priceDisplay.style.margin = "6px 0";
    div.appendChild(priceDisplay);

    gramInput.oninput = () => {
      let grams = parseFloat(gramInput.value);
      if(isNaN(grams) || grams < 2) grams = 2;
      let price = grams * 10;
      priceDisplay.textContent = `Total: $${price.toFixed(2)} for ${grams}g`;
    };

    const buyBtn = document.createElement("button");
    buyBtn.className = "neon-btn";
    buyBtn.textContent = "Buy";
    buyBtn.onclick = () => {
      if(localStorage.getItem("hasAccess") !== "true"){ alert("Token required!"); return; }
      let grams = parseFloat(gramInput.value);
      if(isNaN(grams) || grams < 2){ alert("Minimum order is 2 grams ($20)"); return; }
      let price = grams * 10;
      alert(`Order confirmed:\n${p.name}\n${grams}g - $${price.toFixed(2)}`);
    };
    div.appendChild(buyBtn);

    container.appendChild(div);
  });

  if(user.isAdmin || ADMIN_EMAILS.includes(user.telegram)){
    document.getElementById("adminIcon").style.display="inline";
    document.getElementById("adminIcon").onclick = ()=>window.location.href="dashboard.html";
  }
}

// === DASHBOARD LOGIC ===
if(window.location.pathname.endsWith("dashboard.html")){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user || !(user.isAdmin || ADMIN_EMAILS.includes(user.telegram))){ alert("Access denied"); window.location.href="index.html"; }

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

function exportData(){
  const data = {
    users: JSON.parse(localStorage.getItem(USERS_KEY)),
    tokens: JSON.parse(localStorage.getItem(TOKENS_KEY)),
    products: JSON.parse(localStorage.getItem(PRODUCTS_KEY)),
    store: JSON.parse(localStorage.getItem(STORE_KEY))
  };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download="v1leshop_data.json";
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


