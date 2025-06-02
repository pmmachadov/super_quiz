#!/bin/bash

# Script para deploy a GitHub Pages usando "Deploy from a branch"
echo "🚀 Iniciando deploy a GitHub Pages..."

# 1. Asegurar que estamos en main
git checkout main
echo "✅ En branch main"

# 2. Hacer build de la aplicación
echo "🔨 Construyendo aplicación..."
cd frontend && npm run build
cd ..

# 3. Crear/limpiar branch gh-pages
echo "🧹 Preparando branch gh-pages..."
git branch -D gh-pages 2>/dev/null || true
git checkout --orphan gh-pages

# 4. Limpiar archivos innecesarios
git rm -rf --cached . 2>/dev/null || true
find . -name ".git" -prune -o -type f -exec rm {} \; 2>/dev/null || true
find . -type d -empty -delete 2>/dev/null || true

# 5. Copiar archivos built
echo "📁 Copiando archivos built..."
cp -r frontend/dist/* .
cp frontend/dist/.nojekyll . 2>/dev/null || echo "No .nojekyll found, creating one..."
touch .nojekyll

# 6. Commit y push
echo "💾 Haciendo commit..."
git add .
git commit -m "Deploy to GitHub Pages"

echo "📤 Pushing to gh-pages..."
git push -f origin gh-pages

# 7. Volver a main
git checkout main

echo "✅ ¡Deploy completado!"
echo "🌐 Configure GitHub Pages para usar la branch 'gh-pages'"
echo "🔗 Tu sitio estará en: https://pmmachadov.github.io/super_quiz/"
