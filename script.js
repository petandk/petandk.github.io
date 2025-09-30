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
let userInfo = null;

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
document.addEventListener("DOMContentLoaded", async function () {
  initializeTheme();
  await initializeLanguage();
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
async function initializeLanguage() {
  const savedLang = localStorage.getItem("language") || "en";
  await setLanguage(savedLang);
}

async function setLanguage(language) {
  currentLang = language;
  localStorage.setItem("language", language);

  // Update language button states
  elements.langEs.classList.toggle("active", language === "es");
  elements.langEn.classList.toggle("active", language === "en");

  // Update HTML lang attribute
  document.documentElement.lang = language;

  // Update all translatable content
  await updateTranslations();
}

async function updateTranslations() {
  const translations = lang[currentLang];

  // Update static content
  elements.pageTitle.textContent = translations.pageTitle;
  elements.navTitle.textContent = translations.navTitle;
  elements.heroGreeting.textContent = translations.greeting;
  elements.aboutTitle.textContent = translations.about;

  // Update about text from file
  const aboutText = await fetchAboutText(currentLang);
  elements.aboutText.innerHTML = `<p>${aboutText}</p>`;
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
    await updateUserInfo();
    updateContactInfo();
  }

  if (reposData) {
    updateProjects();
  }
}

// Event Listeners
function setupEventListeners() {
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.langEs.addEventListener(
    "click",
    async () => await setLanguage("es")
  );
  elements.langEn.addEventListener(
    "click",
    async () => await setLanguage("en")
  );

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
    userInfo = await fetchInfoFromFile();
    const username = userInfo.username;

    if (!username) {
      throw new Error("Unable to get username");
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
    await updateUserInfo();
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

async function fetchInfoFromFile() {
  try {
    const response = await fetch("info");
    if (response.ok) {
      const content = await response.text();
      const lines = content.trim().split("\n");
      return {
        username: lines[0]?.trim() || null,
        email: lines[1]?.trim() || null,
      };
    }
  } catch (error) {
    console.warn("Could not read info file:", error);
  }

  // Fallback: try to extract username from domain
  return {
    username: extractUsernameFromDomain(),
    email: null,
  };
}

async function fetchAboutText(language) {
  try {
    const fileName = language === "es" ? "sobreMi" : "aboutMe";
    const response = await fetch(fileName);
    if (response.ok) {
      const text = await response.text();
      // Convert double line breaks to paragraph breaks, single line breaks to <br>
      return text
        .trim()
        .split("\n\n")
        .map((paragraph) => paragraph.replace(/\n/g, "<br>"))
        .join("</p><p>");
    }
  } catch (error) {
    console.warn(`Could not read ${language} about file:`, error);
  }

  // Fallback to hardcoded text
  return language === "es"
    ? "Tu texto personalizado en español aquí."
    : "Your custom text in English here.";
}

function extractUsernameFromDomain() {
  const hostname = window.location.hostname;

  // For GitHub Pages (username.github.io)
  if (hostname.endsWith(".github.io")) {
    return hostname.split(".")[0];
  }

  // For local development or unknown domains
  return "octocat"; // Default fallback
}

async function updateUserInfo() {
  const translations = lang[currentLang];

  // Update basic info
  elements.userName.textContent = userData.name || userData.login;

  // Use GitHub bio if available, otherwise use about text from file
  if (userData.bio) {
    // For GitHub bio, preserve line breaks with <br> tags
    elements.userBio.innerHTML = userData.bio.replace(/\n/g, "<br>");
  } else {
    const aboutText = await fetchAboutText(currentLang);
    elements.userBio.innerHTML = `<p>${aboutText}</p>`;
  }
  elements.userAvatar.src = userData.avatar_url;
  elements.userAvatar.alt = `${userData.name || userData.login} avatar`;

  // Update hero links
  elements.heroLinks.innerHTML = "";

  // Email link - use custom email from info file, or fallback to GitHub email
  const emailToUse = userInfo?.email || userData.email;
  if (emailToUse) {
    addHeroLink(
      '<i class="fas fa-envelope"></i>',
      translations.email,
      `mailto:${emailToUse}`
    );
  }

  // Website/blog link
  if (userData.blog) {
    const url = userData.blog.startsWith("http")
      ? userData.blog
      : `https://${userData.blog}`;
    addHeroLink('<i class="fas fa-globe"></i>', translations.website, url);
  }

  // Twitter link
  if (userData.twitter_username) {
    addHeroLink(
      '<i class="fab fa-twitter"></i>',
      translations.twitter,
      `https://twitter.com/${userData.twitter_username}`
    );
  }

  // GitHub link
  addHeroLink('<i class="fab fa-github"></i>', "GitHub", userData.html_url);
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

  // Always show the contact form - it will use the email from info file
  // No need to hide the form or show GitHub contact info since it's redundant
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
