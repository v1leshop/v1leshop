#!/usr/bin/env bash
set -e

echo "🔐 v1leshop backend installer"

if [ -z "$ADMIN_PASSWORD" ] || [ -z "$ADMIN_KEY" ]; then
  echo "❌ Missing env vars"
  exit 1
fi

git clone https://github.com/v1leshop/v1leshop.git || true
cd v1leshop/server

npm install

cat > ../.env <<EOF
ADMIN_USERNAME=v1leshop
ADMIN_EMAIL=v1le.shopsite@gmail.com
ADMIN_PASSWORD=$ADMIN_PASSWORD
ADMIN_KEY=$ADMIN_KEY
JWT_SECRET=$(openssl rand -hex 32)
EOF

echo "✅ Installed"
echo "▶ Run: cd server && npm start"
