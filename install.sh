#!/bin/bash

# === CONFIG ===
REPO="https://github.com/v1leshop/v1leshop.git"
DIR="v1leshop"

# === CLONE REPO IF NOT EXISTS ===
if [ ! -d "$DIR" ]; then
  git clone $REPO
fi
cd $DIR || exit

# === SET GIT IDENTITY (LOCAL) ===
git config user.name "v1leshop"
git config user.email "v1le.shopsite@gmail.com"

# === CREATE FILES ===

# index.html
cat > index.html <<'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>v1leshop - Login/Signup</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <h1 class="neon-text">v1leshop</h1>

  <h2>Login</h2>
  <input id="loginUsername" placeholder="Username" type="text">
  <input id="loginPassword" placeholder="
