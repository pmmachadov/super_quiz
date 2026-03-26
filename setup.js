#!/usr/bin/env node

/**
 * Script de Setup para Super Quiz
 * Automatiza la instalación inicial del proyecto
 * 
 * Uso: node setup.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, cwd = __dirname) {
  try {
    return execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
  } catch (error) {
    log(`❌ Error ejecutando: ${command}`, 'red');
    throw error;
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

async function setup() {
  log('\n🎯 Super Quiz - Setup\n', 'cyan');
  
  // 1. Verificar Node.js
  log('📋 Verificando Node.js...', 'blue');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 18) {
      log(`⚠️  Node.js ${nodeVersion} detectado. Se recomienda v18+`, 'yellow');
    } else {
      log(`✅ Node.js ${nodeVersion}`, 'green');
    }
  } catch {
    log('❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/', 'red');
    process.exit(1);
  }
  
  // 2. Instalar dependencias raíz
  log('\n📦 Instalando dependencias del proyecto...', 'blue');
  exec('npm install');
  
  // 3. Instalar dependencias backend
  log('\n📦 Instalando dependencias del backend...', 'blue');
  exec('npm install', path.join(__dirname, 'backend'));
  
  // 4. Instalar dependencias frontend
  log('\n📦 Instalando dependencias del frontend...', 'blue');
  exec('npm install', path.join(__dirname, 'frontend'));
  
  // 5. Crear archivo .env si no existe
  log('\n⚙️  Configurando variables de entorno...', 'blue');
  if (!fileExists('.env')) {
    if (fileExists('.env.example')) {
      fs.copyFileSync(
        path.join(__dirname, '.env.example'),
        path.join(__dirname, '.env')
      );
      log('✅ Archivo .env creado desde .env.example', 'green');
      log('📝 Por favor edita el archivo .env con tus credenciales de MongoDB', 'yellow');
    } else {
      log('⚠️  No se encontró .env.example. Crea el archivo .env manualmente.', 'yellow');
    }
  } else {
    log('✅ Archivo .env ya existe', 'green');
  }
  
  // 6. Mensaje final
  log('\n' + '='.repeat(50), 'cyan');
  log('✅ Setup completado!', 'green');
  log('='.repeat(50) + '\n', 'cyan');
  
  log('Para iniciar el proyecto en desarrollo:', 'blue');
  log('\n  Terminal 1 (Backend):', 'yellow');
  log('  cd backend && npm run dev');
  log('\n  Terminal 2 (Frontend):', 'yellow');
  log('  cd frontend && npm run dev\n');
  
  log('Documentación:', 'blue');
  log('  📖 README.md - Guía completa del proyecto');
  log('  📖 CONTRIBUTING.md - Guía de contribución');
  log('  📖 .env.example - Variables de entorno\n');
}

setup().catch(error => {
  log(`\n❌ Setup falló: ${error.message}`, 'red');
  process.exit(1);
});
