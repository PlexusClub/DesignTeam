async function loadData() {
  try {
    const response = await fetch("./resources/data.json");
    const plexusData = await response.json();

    renderTeam(plexusData.team);
    renderRoles(plexusData.roles);
    renderGallery(plexusData.gallery);
    setupMobileMenu();
    setupScrolling();
    setupFadeIn();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function createCard(member) {
  const tenureBadge = member.tenure 
    ? `<div class="absolute top-4 right-4 bg-gray-900/90 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 backdrop-blur-sm shadow-lg">
         ${member.tenure}
       </div>`
    : '';

  const hasBio = member.bio && member.bio.trim() !== "";
  const bioHtml = hasBio
    ? `<p class="text-gray-300 mb-6 text-sm leading-relaxed line-clamp-3">
         ${member.bio}
       </p>`
    : '';

  const socialIconsHtml = `
    ${member.social?.linkedin ? `<a href="${member.social.linkedin}" target="_blank" class="text-gray-400 hover:text-indigo-300 transition-colors transform hover:-translate-y-0.5"><i class="fab fa-linkedin text-lg"></i></a>` : ""}
    ${member.social?.github ? `<a href="${member.social.github}" target="_blank" class="text-gray-400 hover:text-indigo-300 transition-colors transform hover:-translate-y-0.5"><i class="fab fa-github text-lg"></i></a>` : ""}
    ${member.social?.twitter ? `<a href="${member.social.twitter}" target="_blank" class="text-gray-400 hover:text-indigo-300 transition-colors transform hover:-translate-y-0.5"><i class="fab fa-twitter text-lg"></i></a>` : ""}
    ${member.social?.instagram ? `<a href="${member.social.instagram}" target="_blank" class="text-gray-400 hover:text-pink-400 transition-colors transform hover:-translate-y-0.5"><i class="fab fa-instagram text-lg"></i></a>` : ""}
    ${member.social?.behance ? `<a href="${member.social.behance}" target="_blank" class="text-gray-400 hover:text-blue-400 transition-colors transform hover:-translate-y-0.5"><i class="fab fa-behance text-lg"></i></a>` : ""}
  `;

  const hasSocial = socialIconsHtml.trim().length > 0;
  
  const socialSectionHtml = hasSocial 
    ? `<div class="flex space-x-4 border-t border-gray-700/50 pt-4 mt-auto">
         ${socialIconsHtml}
       </div>` 
    : '';

  const cardContentHtml = (hasBio || hasSocial)
    ? `<div class="p-6 flex-grow flex flex-col justify-between">
         ${bioHtml}
         ${socialSectionHtml}
       </div>`
    : '';

  return `
    <div class="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden card-hover group h-full flex flex-col">
      <div class="relative h-64 overflow-hidden">
        <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
        
        ${tenureBadge}
        
        <div class="absolute bottom-4 left-4 right-4">
          <h3 class="text-xl font-bold text-white truncate">${member.name}</h3>
          <p class="text-indigo-300 text-sm font-medium">${member.role}</p>
        </div>
      </div>
      
      ${cardContentHtml}
    </div>
  `;
}

function renderTeam(teamData) {
  const teamContainer = document.getElementById("team-container");
  const alumniContainer = document.getElementById("alumni-container");
  const alumniSection = document.getElementById("alumni-section");

  const currentTeam = [...teamData.heads, ...teamData.members];
  
  if (teamContainer) {
    teamContainer.innerHTML = currentTeam.map(member => createCard(member)).join('');
  }

  if (teamData.alumni && teamData.alumni.length > 0) {
    if (alumniSection) alumniSection.classList.remove("hidden");
    if (alumniContainer) {
      alumniContainer.innerHTML = teamData.alumni.map(member => createCard(member)).join('');
    }
  } else {
    if (alumniSection) alumniSection.classList.add("hidden");
  }
}

function renderRoles(roles) {
  const rolesContainer = document.getElementById("roles-container");
  rolesContainer.innerHTML = "";

  roles.forEach(role => {
    const responsibilitiesHTML = role.responsibilities
      .map(res => `<li class="flex items-start mb-2"><i class="fas fa-check text-indigo-400 mt-1 mr-2"></i><span class="text-gray-300">${res}</span></li>`)
      .join("");

    rolesContainer.innerHTML += `
      <div class="role-card p-6 rounded-xl border border-gray-700">
        <div class="${role.color} mb-4">
          <i class="${role.icon} text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-4">${role.title}</h3>
        <ul class="text-sm">${responsibilitiesHTML}</ul>
      </div>
    `;
  });
}

// Render gallery
function renderGallery(gallery) {
  const galleryContainer = document.getElementById("gallery-container");
  galleryContainer.innerHTML = "";

  gallery.forEach(item => {
    const cardHTML = `
      <div class="group relative rounded-xl overflow-hidden card-hover h-64">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
          <h3 class="text-white font-bold text-lg mb-1">${item.title}</h3>
          <p class="text-gray-300 text-sm line-clamp-3">${item.description}</p>
          <span class="w-[max-content] inline-block mt-2 px-2 py-1 bg-indigo-600/80 text-white text-xs rounded-full">${item.type}</span>
        </div>
      </div>
    `;

    galleryContainer.innerHTML += item.link
      ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${cardHTML}</a>`
      : cardHTML;
  });
}

// Mobile menu
function setupMobileMenu() {
  const button = document.getElementById("mobile-menu-button");
  const menu = document.getElementById("mobile-menu");

  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  document.querySelectorAll("#mobile-menu a").forEach(link => {
    link.addEventListener("click", () => menu.classList.add("hidden"));
  });
}

// Smooth scrolling
function setupScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  });
}

// Fade-in animation
function setupFadeIn() {
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("fade-in");
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
}

// Initialize
document.addEventListener("DOMContentLoaded", loadData);