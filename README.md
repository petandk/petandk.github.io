# Portfolio Personal - GitHub Pages

Un portfolio personal moderno y responsive que se conecta automáticamente con la API de GitHub para mostrar tu información de perfil y repositorios públicos.

## 🌐 Demo

Visita: [rmanzanas.com](https://rmanzanas.com) o [petandk.github.io](https://petandk.github.io)

## ✨ Características

- 🎨 **Tema claro/oscuro** - Cambio automático entre temas con persistencia local
- 🌍 **Multiidioma** - Soporte para Español e Inglés
- 📱 **Responsive** - Diseño adaptable a todos los dispositivos
- 🔄 **Integración con GitHub API** - Carga automática de:
  - Avatar y nombre de usuario
  - Bio del perfil
  - Enlaces sociales (email, website, LinkedIn)
  - Repositorios públicos con estrellas
- ⚡ **Rendimiento optimizado** - Carga rápida y eficiente
- 🎯 **SEO optimizado** - Meta tags para redes sociales (Open Graph)

## 📁 Estructura del Proyecto

```
petandk.github.io/
│
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript y API
├── favicon.svg         # Icono del sitio
│
├── info                # Archivo con usuario de GitHub, email y LinkedIn
├── aboutMe             # Descripción "Acerca de mí" (inglés)
├── sobreMi             # Descripción "Acerca de mí" (español)
│
├── CNAME               # Configuración de dominio personalizado
└── README.md           # Este archivo
```

## 🚀 Configuración Rápida

### 1. Configurar Usuario de GitHub, Email y LinkedIn

Edita el archivo **`info`** con tu usuario de GitHub, email y URL de LinkedIn (una línea por dato):

```
tu-usuario-github
tu-email@ejemplo.com
https://www.linkedin.com/in/tu-perfil
```

**¿Para qué sirve cada línea?**

- **Línea 1 (usuario)**: Se usa para conectar con la API de GitHub y obtener tu perfil, avatar, bio y repositorios
- **Línea 2 (email)**: Email personalizado que aparecerá como enlace de contacto en tu portfolio (puede ser diferente al de GitHub)
- **Línea 3 (LinkedIn, opcional)**: URL de tu perfil de LinkedIn; si falta, no se muestra el botón

### 2. Personalizar "Acerca de Mí"

#### Archivo `aboutMe` (inglés):

Escribe tu descripción profesional en inglés. Ejemplo:

```
I'm a web developer with technical training and a strong self-taught mindset.
Through my studies and personal projects, I've learned to build clean, functional,
and accessible interfaces, paying close attention to both structure and visual clarity.

I'm especially interested in automation, modular code organization, and designing
systems that are clear, sustainable, and easy to maintain.
```

#### Archivo `sobreMi` (español):

Escribe tu descripción profesional en español. Ejemplo:

```
Soy desarrollador web con formación técnica y una fuerte orientación autodidacta.
A lo largo de mis estudios y proyectos personales he aprendido a construir interfaces
limpias, funcionales y accesibles, cuidando tanto la estructura como la estética.

Me interesa especialmente la automatización, la organización modular del código y
el diseño de sistemas que sean claros, sostenibles y fáciles de mantener.
```

### 3. Configurar Dominio Personalizado (Opcional)

Si tienes un dominio personalizado, edita el archivo **`CNAME`** con tu dominio:

```
tudominio.com
```

Luego configura los DNS de tu dominio apuntando a GitHub Pages:

- **Tipo A** → `185.199.108.153`
- **Tipo A** → `185.199.109.153`
- **Tipo A** → `185.199.110.153`
- **Tipo A** → `185.199.111.153`

O para subdominios (www):

- **Tipo CNAME** → `tu-usuario.github.io`

## 🎨 Personalización Avanzada

### Cambiar Colores y Estilos

Edita `styles.css` y modifica las variables CSS en `:root`:

```css
:root {
  --primary-color: #4a90e2;
  --secondary-color: #7b68ee;
  --accent-color: #ff6b6b;
  /* ... más variables */
}
```

### Modificar Textos de la Interfaz

Edita `script.js` en el objeto `lang`:

```javascript
const lang = {
  es: {
    greeting: "¡Hola!",
    projects: "Proyectos",
    // ... más textos
  },
  en: {
    greeting: "Hello!",
    projects: "Projects",
    // ... más textos
  },
};
```

### Cambiar Meta Tags SEO

Edita `index.html` en la sección `<head>`:

```html
<meta name="description" content="Tu descripción personalizada" />
<meta name="keywords" content="tus, palabras, clave" />
<meta name="author" content="Tu Nombre" />
```

## 📝 Archivos a Modificar para Personalizar

| Archivo       | Qué modificar                                 | Descripción                                    | Obligatorio |
| ------------- | --------------------------------------------- | ---------------------------------------------- | ----------- |
| `info`        | Usuario de GitHub (línea 1), email (línea 2) y LinkedIn (línea 3) | Usuario para API de GitHub, email y LinkedIn | ✅ Sí       |
| `aboutMe`     | Descripción en inglés                         | Tu presentación profesional en inglés          | ✅ Sí       |
| `sobreMi`     | Descripción en español                        | Tu presentación profesional en español         | ✅ Sí       |
| `CNAME`       | Tu dominio personalizado                      | Dominio custom (ej: tudominio.com)             | ❌ No       |
| `favicon.svg` | Tu icono personalizado                        | Icono del sitio web                            | ❌ No       |
| `styles.css`  | Colores y estilos                             | Personalización de diseño                      | ❌ No       |
| `script.js`   | Textos de interfaz                            | Traducciones y textos                          | ❌ No       |
| `index.html`  | Meta tags SEO                                 | Optimización para buscadores                   | ❌ No       |

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript (Vanilla)** - Sin dependencias externas
- **GitHub API** - Para datos dinámicos del perfil
- **Google Fonts** - Tipografía Inter
- **Flag Icons** - Iconos de banderas para idiomas
- **Font Awesome** - Iconos sociales

## 📦 Despliegue en GitHub Pages

1. **Asegúrate de que el repositorio sea público**
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona la rama `main` y carpeta `/ (root)`
4. Guarda los cambios
5. Tu sitio estará disponible en `https://tu-usuario.github.io`

## ⚠️ Nota Importante sobre Privacidad

⚠️ **GitHub Pages solo funciona con repositorios públicos** (en cuentas gratuitas).

Si cambias el repositorio a privado:

- ❌ GitHub Pages se deshabilitará automáticamente
- ❌ Tu dominio dejará de mostrar el sitio
- ❌ El sitio no será accesible

### Alternativas si necesitas privacidad:

1. **GitHub Pro/Teams** - Permite repos privados con GitHub Pages
2. **Netlify/Vercel** - Soportan despliegue desde repos privados gratis
3. **Cloudflare Pages** - Otra alternativa con repos privados

## 🤖 Créditos

Este proyecto fue desarrollado con la ayuda de varias herramientas de Inteligencia Artificial, incluyendo asistentes de código y modelos de lenguaje que contribuyeron al diseño, estructura y funcionalidad del portfolio.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún error o tienes sugerencias:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para más información, visita mi [perfil de GitHub](https://github.com/petandk) o envía un email a [raul@rmanzanas.com](mailto:raul@rmanzanas.com).

---

⭐ Si este proyecto te resultó útil, ¡considera darle una estrella en GitHub!
