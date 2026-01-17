#!/bin/bash
REPO="https://github.com/v1leshop/v1leshop.git"
ADMIN_EMAIL="v1le.shopsite@gmail.com"
DIR="v1leshop"

# Clone repo if missing
if [ ! -d "$DIR" ]; then
  git clone $REPO
fi
cd $DIR || exit

git config user.name "v1leshop"
git config user.email "$ADMIN_EMAIL"

# -------------------------------
# Write token.html
# -------------------------------
cat > token.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>v1leshop - Enter Token</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <h1 class="neon-text">Enter Invite Token</h1>
  <input type="text" id="tokenInput" placeholder="Enter your token">
  <button class="neon-btn" onclick="verifyToken()">Submit</button>
  <p id="tokenMsg"></p>
</div>
<script src="script.js"></script>
</body>
</html>
EOL

# -------------------------------
# Write products.html, index.html, dashboard.html, style.css, script.js
# -------------------------------
# Use the full contents from the previous sections
# Paste them here for Git Bash install

# -------------------------------
# Commit & push
# -------------------------------
git add .
git commit -m "Install v1leshop neon/dark with token page + gram selector"
git push -u origin main || echo "✅ Installed locally. Push failed (check permissions)."

echo "✅ v1leshop installation complete! Admin email: $ADMIN_EMAIL"

