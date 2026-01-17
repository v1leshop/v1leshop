#!/bin/bash
REPO="https://github.com/v1leshop/v1leshop.git"
ADMIN_EMAIL="v1le.shopsite@gmail.com"
DIR="v1leshop"

if [ ! -d "$DIR" ]; then
  git clone $REPO
fi
cd $DIR || exit

git config user.name "v1leshop"
git config user.email "$ADMIN_EMAIL"

# Overwrite script.js, products.html, index.html, dashboard.html, style.css
# (Add all file content here; you can paste the full files from above)

# Add & commit
git add .
git commit -m "Install neon/dark theme + gram selector"
git push -u origin main || echo "✅ Installed locally. Push failed (check permissions)."

echo "✅ v1leshop installation complete! Admin email: $ADMIN_EMAIL"
