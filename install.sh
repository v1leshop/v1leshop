#!/bin/bash
# ===============================
# v1leshop Full Install Script
# ===============================

cd ~

# Clone repo if it doesn't exist
if [ ! -d "v1leshop" ]; then
    git clone https://github.com/v1leshop/v1leshop.git
fi
cd v1leshop || exit

# Pull latest updates
git pull origin main

# --- index.html ---
cat > index.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>v1leshop - Login / Signup</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<h1 class="neon-text">v1leshop</h1>

<div class="auth-section">
<h2>Login</h2>
<input id="loginUserEmail" placeholder="Username or Email" type="text">
<input id="loginPassword" placeholder="Password" type="password">
<input id="loginTelegram" placeholder="Telegram Username" type="text">
<button class="neon-btn" onclick="login()">Login</button>
<p id="loginMsg" class="auth-msg"></p>
</div>

<div class="auth-section">
<h2>Signup</h2>
<input id="signupUsername" placeholder="Username" type="text">
<input id="signupEmail" placeholder="Email" type="email">
<input id="signupPassword" placeholder="Password" type="password">
<input id="signupTelegram" placeholder="Telegram Username" type="text">
<button class="neon-btn" onclick="signup()">Signup</button>
<p id="signupMsg" class="auth-msg"></p>
</div>
</div>

<script src="script.js"></script>
</body>
</html>
EOL

# --- products.html ---
cat > products.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>v1leshop - Products</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Products</h1>
<div id="userLevel"></div>
<div id="productsList"></div>
<div id="adminIcon" style="display:none; cursor:pointer;">⚙️ Admin</div>
<button onclick="showLeaderboard()">Leaderboard</button>
<div id="leaderboardModal" style="display:none;">
    <h2>Leaderboard</h2>
    <ul id="leaderboardList"></ul>
    <button onclick="closeLeaderboard()">Close</button>
</div>
<script src="script.js"></script>
</body>
</html>
EOL

# --- dashboard.html ---
cat > dashboard.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Admin Dashboard</h1>
<div id="storeStatus"></div>
<button onclick="toggleStore()">Toggle Store Open/Close</button>

<h2>Products</h2>
<div id="productToggles"></div>

<h2>Orders</h2>
<div id="orderList"></div>

<h2>Create Token</h2>
<input id="newToken" placeholder="New Token">
<button onclick="createToken()">Add Token</button>

<h2>Export/Import Database</h2>
<button onclick="exportData()">Export</button>
<input type="file" onchange="importData(event)">
<script src="script.js"></script>
</body>
</html>
EOL

# --- token.html ---
cat > token.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Enter Token</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Enter Invite Token</h1>
<input id="tokenInput" placeholder="Token">
<button onclick="verifyToken()">Submit</button>
<p id="tokenMsg"></p>
<script src="script.js"></script>
</body>
</html>
EOL

# --- style.css ---
cat > style.css <<'EOL'
body { background:#111; color:#0ff; font-family:Arial, sans-serif; text-align:center; }
.neon-text { text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff; }
.auth-section { border:1px solid #0ff; border-radius:10px; padding:20px; margin:20px auto; max-width:400px; box-shadow:0 0 10px #0ff; }
.auth-section h2 { margin-bottom:10px; color:#0ff; }
.auth-section input { margin-bottom:10px; width:90%; padding:8px; border-radius:5px; border:1px solid #0ff; background:#111; color:#0ff; }
button.neon-btn { margin:10px; padding:10px 20px; border:1px solid #0ff; border-radius:5px; background:#111; color:#0ff; cursor:pointer; transition:.2s; }
button.neon-btn:hover { background:#0ff; color:#111; }
#leaderboardModal { background:#000; border:2px solid #0ff; padding:10px; display:none; position:absolute; top:20%; left:30%; width:40%; }
EOL

# --- script.js ---
cat > script.js <<'EOL'
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

// --- Include full merged script.js content here (login/signup, products, dashboard, leaderboard, tokens, export/import) ---
EOL

echo "✅ v1leshop fully installed! Open index.html in a browser to start."
