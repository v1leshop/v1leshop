// === LOCAL STORAGE KEYS ===
const USERS_KEY = "v1leshopUsers";
const TOKENS_KEY = "v1leshopTokens";
const STORE_KEY = "v1leshopStore";
const PRODUCTS_KEY = "v1leshopProducts";
const ORDERS_KEY = "v1leshopOrders";

// === ADMIN CONFIG ===
const ADMIN_EMAILS = ["v1leshop"];
const ADMIN_ACCOUNT = {
    username: "v1leshop",
    password: "Rhyco2121",
    telegram: "v1le shop",
    email: "v1le.shopsite@gmail.com",
    level: 99,
    xp: 0,
    isAdmin: true,
    private: false
};

// === INIT DEFAULT DATA ===
if(!localStorage.getItem(USERS_KEY)){
    localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_ACCOUNT]));
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
if(!localStorage.getItem(ORDERS_KEY)){
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
}

// === TOKEN PAGE LOGIC ===
function verifyToken(){
    const token = document.getElementById("tokenInput").value.trim();
    const validTokens = JSON.parse(localStorage.getItem(TOKENS_KEY));
    if(validTokens.includes(token)){
        localStorage.setItem("hasAccess","true");
        window.location.href="products.html";
    } else {
        document.getElementById("tokenMsg").textContent="Invalid token!";
    }
}
if(window.location.pathname.endsWith("products.html")){
    if(localStorage.getItem("hasAccess") !== "true"){
        window.location.href="token.html";
    }
}

// === AUTH FUNCTIONS ===
function signup(){
    const u = document.getElementById("signupUsername").value.trim();
    const p = document.getElementById("signupPassword").value.trim();
    const t = document.getElementById("signupTelegram").value.trim();
    const e = document.getElementById("signupEmail").value.trim();

    if(!u || !p || !t || !e){
        document.getElementById("signupMsg").textContent="All fields are required!";
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));

    // Protect admin account
    if(u.toLowerCase() === ADMIN_ACCOUNT.username.toLowerCase() || e.toLowerCase() === ADMIN_ACCOUNT.email.toLowerCase()){
        document.getElementById("signupMsg").textContent="Cannot use admin username/email!";
        return;
    }

    if(users.find(x=>x.username===u || x.email===e)){
        document.getElementById("signupMsg").textContent="Username or Email already exists!";
        return;
    }

    users.push({username:u,password:p,telegram:t,email:e,level:1,xp:0,isAdmin:false,private:false});
    localStorage.setItem(USERS_KEY,JSON.stringify(users));
    document.getElementById("signupMsg").textContent="Signup successful! You can now login.";
}

function login(){
    const u = document.getElementById("loginUserEmail").value.trim();
    const p = document.getElementById("loginPassword").value.trim();
    const t = document.getElementById("loginTelegram").value.trim();

    if(!u || !p || !t){
        document.getElementById("loginMsg").textContent="All fields are required!";
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(x=> 
        (x.username.toLowerCase() === u.toLowerCase() || x.email.toLowerCase() === u.toLowerCase()) &&
        x.password === p &&
        x.telegram === t
    );

    if(!user){
        document.getElementById("loginMsg").textContent="Login failed!";
        return;
    }

    localStorage.setItem("currentUser",JSON.stringify(user));
    window.location.href="products.html";
}

function logout(){
    localStorage.removeItem("currentUser");
    window.location.href="index.html";
}

// === PRODUCTS PAGE LOGIC ===
if(window.location.pathname.endsWith("products.html")){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(!currentUser){ alert("Login required"); window.location.href="index.html"; }

    const store = JSON.parse(localStorage.getItem(STORE_KEY));
    if(!store.open){ alert("Store is closed"); window.location.href="index.html"; }

    document.getElementById("userLevel").textContent = `Level: ${currentUser.level} | XP: ${currentUser.xp}`;

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
        gramInput.min = "2";
        gramInput.placeholder = "Enter grams (min 2g / $20)";
        div.appendChild(gramInput);

        const priceDisplay = document.createElement("div");
        priceDisplay.style.margin = "6px 0";
        div.appendChild(priceDisplay);

        gramInput.oninput = () => {
            let grams = parseFloat(gramInput.value);
            if(isNaN(grams) || grams<2) grams=2;
            let price = grams*10;
            priceDisplay.textContent = `Total: $${price.toFixed(2)} for ${grams}g`;
        };

        const buyBtn = document.createElement("button");
        buyBtn.className = "neon-btn";
        buyBtn.textContent = "Buy";
        buyBtn.onclick = ()=>{
            if(localStorage.getItem("hasAccess") !== "true"){ alert("Token required"); return; }
            let grams = parseFloat(gramInput.value);
            if(isNaN(grams) || grams<2){ alert("Minimum order is 2g ($20)"); return; }
            let price = grams*10;

            // Save order
            const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
            orders.push({
                user: currentUser.username,
                telegram: currentUser.telegram,
                email: currentUser.email,
                product: p.name,
                grams: grams,
                total: price,
                status: "pending"
            });
            localStorage.setItem(ORDERS_KEY,JSON.stringify(orders));

            // Give XP
            currentUser.xp += Math.floor(price/10);
            currentUser.level = Math.floor(currentUser.xp/100)+1;
            const users = JSON.parse(localStorage.getItem(USERS_KEY));
            const idx = users.findIndex(x=>x.username===currentUser.username);
            users[idx]=currentUser;
            localStorage.setItem(USERS_KEY,JSON.stringify(users));
            localStorage.setItem("currentUser",JSON.stringify(currentUser));
            document.getElementById("userLevel").textContent = `Level: ${currentUser.level} | XP: ${currentUser.xp}`;
            alert(`Order placed! ${p.name} - ${grams}g for $${price.toFixed(2)}\nYou earned XP!`);
        };
        div.appendChild(buyBtn);
        container.appendChild(div);
    });

    if(currentUser.isAdmin || ADMIN_EMAILS.includes(currentUser.username)){
        document.getElementById("adminIcon").style.display="inline";
        document.getElementById("adminIcon").onclick = ()=>window.location.href="dashboard.html";
    }
}

// === LEADERBOARD ===
function showLeaderboard(){
    const modal = document.getElementById("leaderboardModal");
    modal.style.display="block";
    const list = document.getElementById("leaderboardList");
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    list.innerHTML="";
    const sorted = users.sort((a,b)=>b.xp-a.xp).slice(0,10);
    sorted.forEach(u=>{
        const li = document.createElement("li");
        li.textContent = u.private ? `Private - Level ${u.level} | XP: ${u.xp}` : `${u.username} - Level ${u.level} | XP: ${u.xp}`;
        list.appendChild(li);
    });
}

function closeLeaderboard(){
    document.getElementById("leaderboardModal").style.display="none";
}

// === DASHBOARD LOGIC ===
if(window.location.pathname.endsWith("dashboard.html")){
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user || !(user.isAdmin || ADMIN_EMAILS.includes(user.username))){
        alert("Access denied"); 
        window.location.href="index.html";
    }
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
            localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products));
            renderDashboard();
        };
        container.appendChild(btn);
    });

    const store = JSON.parse(localStorage.getItem(STORE_KEY));
    document.getElementById("storeStatus").textContent = store.open?"Store is Open":"Store is Closed";

    // Orders
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
    const orderDiv = document.getElementById("orderList");
    orderDiv.innerHTML="";
    orders.forEach((o,i)=>{
        if(o.status==="pending"){
            const div = document.createElement("div");
            div.innerHTML = `<b>${o.product}</b> - ${o.grams}g - $${o.total}<br>
            User: ${o.user}<br>Email: ${o.email}<br>Telegram: ${o.telegram}`;
            
            const acceptBtn = document.createElement("button");
            acceptBtn.textContent="Accept";
            acceptBtn.onclick=()=>{
                o.status="accepted";
                orders[i]=o;
                localStorage.setItem(ORDERS_KEY,JSON.stringify(orders));
                renderDashboard();
            };
            
            const rejectBtn = document.createElement("button");
            rejectBtn.textContent="Reject";
            rejectBtn.onclick=()=>{
                o.status="rejected";
                orders[i]=o;
                localStorage.setItem(ORDERS_KEY,JSON.stringify(orders));
                renderDashboard();
            };
            
            div.appendChild(acceptBtn);
            div.appendChild(rejectBtn);
            orderDiv.appendChild(div);
        }
    });
}

// === DASHBOARD FUNCTIONS ===
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
        store: JSON.parse(localStorage.getItem(STORE_KEY)),
        orders: JSON.parse(localStorage.getItem(ORDERS_KEY))
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
    reader.onload=function(e){
        const data = JSON.parse(e.target.result);
        localStorage.setItem(USERS_KEY,JSON.stringify(data.users||[]));
        localStorage.setItem(TOKENS_KEY,JSON.stringify(data.tokens||[]));
        localStorage.setItem(PRODUCTS_KEY,JSON.stringify(data.products||[]));
        localStorage.setItem(STORE_KEY,JSON.stringify(data.store||{open:true}));
        localStorage.setItem(ORDERS_KEY,JSON.stringify(data.orders||[]));
        alert("Data imported!");
        if(window.location.pathname.endsWith("dashboard.html")) renderDashboard();
    };
    reader.readAsText(file);
}
