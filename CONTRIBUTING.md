# 🤝 Cómo Contribuir

¡Gracias por tu interés en contribuir a Super Quiz! Este documento te guiará para hacer contribuciones efectivas.

---

## 🚀 Empezando

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. Crea una **branch** para tu feature: `git checkout -b feature/nueva-funcionalidad`
4. **Commit** tus cambios: `git commit -m 'feat: agrega nueva funcionalidad'`
5. **Push** a la branch: `git push origin feature/nueva-funcionalidad`
6. Abre un **Pull Request**

---

## 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Descripción |
|------|-------------|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Formateo, punto y coma, etc. |
| `refactor:` | Refactorización de código |
| `test:` | Añadir o corregir tests |
| `chore:` | Tareas de mantenimiento |

Ejemplos:
```bash
git commit -m "feat: agrega timer animado al quiz"
git commit -m "fix: corrige cálculo de porcentaje en results"
git commit -m "docs: actualiza instrucciones de instalación"
```

---

## 🎨 Estilo de Código

### JavaScript/React
- Usar **ESLint** configurado en el proyecto
- Preferir **arrow functions** para componentes
- Usar **destructuring** para props
- Nombres de componentes en **PascalCase**
- Hooks personalizados con prefijo **use**

```jsx
// ✅ Bien
const QuizCard = ({ title, questions, onStart }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="quiz-card">
      <h3>{title}</h3>
      <p>{questions.length} preguntas</p>
    </div>
  );
};

// ❌ Evitar
function quizcard(props) {
  return <div>...</div>;
}
```

### CSS
- Usar **clases descriptivas** en kebab-case
- Prefiere **CSS Modules** o **CSS-in-JS** para scoped styles
- Mantener **consistencia** en naming (BEM opcional)

```css
/* ✅ Bien */
.quiz-container { }
.answer-button { }
.timer-progress-bar { }

/* ❌ Evitar */
.q1 { }
.button { }
.temp { }
```

---

## 🧪 Tests

Antes de hacer push, asegúrate de:

```bash
# Linting pasa
npm run lint

# Build exitoso
npm run build

# App funciona localmente
npm run dev
```

---

## 📋 Checklist de Pull Request

- [ ] El código compila sin errores
- [ ] ESLint no reporta warnings críticos
- [ ] He probado la funcionalidad localmente
- [ ] He actualizado la documentación si es necesario
- [ ] Mi código sigue las convenciones del proyecto

---

## 🐛 Reportando Bugs

Usa **GitHub Issues** con este template:

```markdown
**Descripción**
Descripción clara del bug

**Pasos para reproducir**
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento esperado**
Qué debería pasar

**Screenshots**
Si aplica

**Entorno:**
- OS: [ej. Windows 11]
- Navegador: [ej. Chrome 120]
- Versión: [ej. 1.0.0]
```

---

## 💡 Sugerencias de Features

¡Las ideas son bienvenidas! Abre un issue con label `enhancement` describiendo:
- El problema que resuelve
- La solución propuesta
- Alternativas consideradas

---

## 📞 Contacto

¿Preguntas? Contacta al mantenedor:
- GitHub: [@pmachado01](https://github.com/pmachado01)

---

¡Gracias por contribuir! 🎉
