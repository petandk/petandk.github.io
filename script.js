// Language Translations
const lang = {
  es: {
    greeting: "¡Hola!",
    projects: "Proyectos",
    contact: "Contacto",
    about: "Acerca de mí",
    loading: "Cargando...",
    navTitle: "Portafolio",
    pageTitle: "Portafolio",
    aboutText:
      "Soy un desarrollador apasionado que ama crear experiencias digitales increíbles.",
    formName: "Nombre",
    formEmail: "Correo electrónico",
    formMessage: "Mensaje",
    formSubmit: "Enviar mensaje",
    footerText: "© 2025 Portafolio. Hecho con ❤️ usando la API de GitHub.",
    email: "Correo",
    website: "Sitio web",
    twitter: "Twitter",
    viewProject: "Ver proyecto",
    stars: "estrellas",
    noProjects: "No se encontraron proyectos públicos.",
    noEmail: "No hay correo público disponible.",
    errorLoading: "Error al cargar los datos de GitHub.",
    contactMe: "Contáctame",
  },
  en: {
    greeting: "Hello!",
    projects: "Projects",
    contact: "Contact",
    about: "About Me",
    loading: "Loading...",
    navTitle: "Portfolio",
    pageTitle: "Portfolio",
    aboutText:
      "I'm a passionate developer who loves creating amazing digital experiences.",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSubmit: "Send Message",
    footerText: "© 2025 Portfolio. Built with ❤️ using GitHub API.",
    email: "Email",
    website: "Website",
    twitter: "Twitter",
    viewProject: "View project",
    stars: "stars",
    noProjects: "No public projects found.",
    noEmail: "No public email available.",
    errorLoading: "Error loading GitHub data.",
    contactMe: "Contact me",
  },
};

// Global variables
let currentLang = "en";
let userData = null;
let reposData = null;

// DOM Elements
const elements = {
  loading: document.getElementById("loading"),
  loadingText: document.getElementById("loading-text"),
  themeToggle: document.getElementById("theme-toggle"),
  langEs: document.getElementById("lang-es"),
  langEn: document.getElementById("lang-en"),
  pageTitle: document.getElementById("page-title"),
  navTitle: document.getElementById("nav-title"),
  heroGreeting: document.getElementById("hero-greeting"),
  userName: document.getElementById("user-name"),
  userBio: document.getElementById("user-bio"),
  userAvatar: document.getElementById("user-avatar"),
  heroLinks: document.getElementById("hero-links"),
  aboutTitle: document.getElementById("about-title"),
  aboutText: document.getElementById("about-text"),
  projectsTitle: document.getElementById("projects-title"),
  projectsGrid: document.getElementById("projects-grid"),
  contactTitle: document.getElementById("contact-title"),
  contactInfo: document.getElementById("contact-info"),
  contactForm: document.getElementById("contact-form"),
  formNameLabel: document.getElementById("form-name-label"),
  formEmailLabel: document.getElementById("form-email-label"),
  formMessageLabel: document.getElementById("form-message-label"),
  formSubmit: document.getElementById("form-submit"),
  footerText: document.getElementById("footer-text"),
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeLanguage();
  setupEventListeners();
  loadGitHubData();
});

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeToggle(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
  elements.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  elements.themeToggle.title =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

// Language Management
function initializeLanguage() {
  const savedLang = localStorage.getItem("language") || "en";
  setLanguage(savedLang);
}

function setLanguage(language) {
  currentLang = language;
  localStorage.setItem("language", language);

  // Update language button states
  elements.langEs.classList.toggle("active", language === "es");
  elements.langEn.classList.toggle("active", language === "en");

  // Update HTML lang attribute
  document.documentElement.lang = language;

  // Update all translatable content
  updateTranslations();
}

function updateTranslations() {
  const translations = lang[currentLang];

  // Update static content
  elements.pageTitle.textContent = translations.pageTitle;
  elements.navTitle.textContent = translations.navTitle;
  elements.heroGreeting.textContent = translations.greeting;
  elements.aboutTitle.textContent = translations.about;
  elements.aboutText.textContent = translations.aboutText;
  elements.projectsTitle.textContent = translations.projects;
  elements.contactTitle.textContent = translations.contact;
  elements.formNameLabel.textContent = translations.formName;
  elements.formEmailLabel.textContent = translations.formEmail;
  elements.formMessageLabel.textContent = translations.formMessage;
  elements.formSubmit.textContent = translations.formSubmit;
  elements.footerText.innerHTML = translations.footerText;
  elements.loadingText.textContent = translations.loading;

  // Update dynamic content if data is loaded
  if (userData) {
    updateUserInfo();
    updateContactInfo();
  }

  if (reposData) {
    updateProjects();
  }
}

// Event Listeners
function setupEventListeners() {
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.langEs.addEventListener("click", () => setLanguage("es"));
  elements.langEn.addEventListener("click", () => setLanguage("en"));

  // Contact form (placeholder functionality)
  elements.contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(lang[currentLang].contactMe + "!");
  });

  // Smooth scrolling for internal links
  document.addEventListener("click", function (e) {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
}

// GitHub API Integration
async function loadGitHubData() {
  try {
    const username = extractUsernameFromDomain();

    if (!username) {
      throw new Error("Unable to extract username from domain");
    }

    // Fetch user data and repositories
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      ),
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error("Failed to fetch GitHub data");
    }

    userData = await userResponse.json();
    const allRepos = await reposResponse.json();

    // Filter and sort repositories by stars
    reposData = allRepos
      .filter((repo) => !repo.private && !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6); // Show top 6 repositories

    // Update UI with fetched data
    updateUserInfo();
    updateProjects();
    updateContactInfo();
    updateMetaTags();

    // Hide loading spinner
    hideLoading();
  } catch (error) {
    console.error("Error loading GitHub data:", error);
    showError();
    hideLoading();
  }
}

function extractUsernameFromDomain() {
  const hostname = window.location.hostname;

  // For local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "octocat"; // Default GitHub user for testing
  }

  // For GitHub Pages (username.github.io)
  if (hostname.endsWith(".github.io")) {
    return hostname.split(".")[0];
  }

  // For custom domains, try to extract from path or use a fallback
  const pathParts = window.location.pathname.split("/").filter((part) => part);
  if (pathParts.length > 0) {
    return pathParts[0];
  }

  return null;
}

function updateUserInfo() {
  const translations = lang[currentLang];

  // Update basic info
  elements.userName.textContent = userData.name || userData.login;
  elements.userBio.textContent = userData.bio || translations.aboutText;
  elements.userAvatar.src = userData.avatar_url;
  elements.userAvatar.alt = `${userData.name || userData.login} avatar`;

  // Update hero links
  elements.heroLinks.innerHTML = "";

  // Email link
  if (userData.email) {
    addHeroLink("📧", translations.email, `mailto:${userData.email}`);
  }

  // Website/blog link
  if (userData.blog) {
    const url = userData.blog.startsWith("http")
      ? userData.blog
      : `https://${userData.blog}`;
    addHeroLink("🌐", translations.website, url);
  }

  // Twitter link
  if (userData.twitter_username) {
    addHeroLink(
      "🐦",
      translations.twitter,
      `https://twitter.com/${userData.twitter_username}`
    );
  }

  // GitHub link
  addHeroLink("💻", "GitHub", userData.html_url);
}

function addHeroLink(icon, text, url) {
  const link = document.createElement("a");
  link.className = "hero-link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.innerHTML = `${icon} ${text}`;
  elements.heroLinks.appendChild(link);
}

function updateProjects() {
  const translations = lang[currentLang];
  elements.projectsGrid.innerHTML = "";

  if (reposData.length === 0) {
    const noProjects = document.createElement("p");
    noProjects.textContent = translations.noProjects;
    noProjects.style.textAlign = "center";
    noProjects.style.gridColumn = "1 / -1";
    elements.projectsGrid.appendChild(noProjects);
    return;
  }

  reposData.forEach((repo, index) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    projectCard.style.animationDelay = `${index * 0.1}s`;

    projectCard.innerHTML = `
      <div class="project-header">
        <h3 class="project-title">${repo.name}</h3>
        <div class="project-stars">
          ⭐ ${repo.stargazers_count} ${translations.stars}
        </div>
      </div>
      <p class="project-description">
        ${repo.description || "No description available."}
      </p>
      <a href="${
        repo.html_url
      }" target="_blank" rel="noopener noreferrer" class="project-link">
        ${translations.viewProject} →
      </a>
    `;

    elements.projectsGrid.appendChild(projectCard);
  });
}

function updateContactInfo() {
  const translations = lang[currentLang];
  elements.contactInfo.innerHTML = "";

  // Only show contact form if no email is available
  if (!userData.email) {
    const noEmail = document.createElement("div");
    noEmail.className = "contact-item";
    noEmail.innerHTML = `
      <div class="contact-item-icon">📧</div>
      <div class="contact-item-text">${translations.noEmail}</div>
    `;
    elements.contactInfo.appendChild(noEmail);
  } else {
    elements.contactForm.style.display = "none";
  }

  // Add GitHub link
  const githubContact = document.createElement("div");
  githubContact.className = "contact-item";
  githubContact.innerHTML = `
    <div class="contact-item-icon">💻</div>
    <div class="contact-item-text">
      <a href="${userData.html_url}" target="_blank" rel="noopener noreferrer">
        GitHub: ${userData.login}
      </a>
    </div>
  `;
  elements.contactInfo.appendChild(githubContact);
}

function updateMetaTags() {
  // Update page title
  document.title = `${userData.name || userData.login} - Portfolio`;

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && userData.bio) {
    metaDescription.content = userData.bio;
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');

  if (ogTitle)
    ogTitle.content = `${userData.name || userData.login} - Portfolio`;
  if (ogDescription && userData.bio) ogDescription.content = userData.bio;
  if (ogImage) ogImage.content = userData.avatar_url;
  if (ogUrl) ogUrl.content = window.location.href;

  // Update Twitter Card tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]'
  );
  const twitterImage = document.querySelector('meta[name="twitter:image"]');

  if (twitterTitle)
    twitterTitle.content = `${userData.name || userData.login} - Portfolio`;
  if (twitterDescription && userData.bio)
    twitterDescription.content = userData.bio;
  if (twitterImage) twitterImage.content = userData.avatar_url;

  // Update author meta tag
  const metaAuthor = document.querySelector('meta[name="author"]');
  if (metaAuthor) {
    metaAuthor.content = userData.name || userData.login;
  }
}

function hideLoading() {
  elements.loading.classList.add("hidden");
  setTimeout(() => {
    elements.loading.style.display = "none";
  }, 500);
}

function showError() {
  const translations = lang[currentLang];

  // Update loading text to show error
  elements.loadingText.textContent = translations.errorLoading;

  // Set fallback data
  elements.userName.textContent = "Developer";
  elements.userBio.textContent = translations.aboutText;
  elements.userAvatar.src = "https://github.com/github.png";
  elements.userAvatar.alt = "Default avatar";

  // Hide loading after a delay
  setTimeout(() => {
    hideLoading();
  }, 2000);
}

// Intersection Observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for scroll animations
  const sections = document.querySelectorAll("section, .project-card");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Initialize scroll animations after page load
window.addEventListener("load", setupScrollAnimations);
