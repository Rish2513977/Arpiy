/* ============================================================
   APPLE LIQUID GLASS INTERACTIVE ENGINE (2026 EDITION)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const data = loadData();
  renderProfile(data.profile);
  renderSoftware(data.profile.software);
  renderCategories(data.categories);
  renderVideos(data.videos, data.categories, "all");
  renderPricing(data.pricing);
  renderContact(data.profile);
  wireModal();
  wireContactForm(data.profile);
  wireMobileMenu();
  wireScrollState();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Apple Liquid Glass Physics & Dynamics
  initLiquidGlassEngine();
});

/* ============================================================
   RENDERERS
   ============================================================ */

function renderProfile(p) {
  document.title = p.name + " — " + p.role;
  const brandName = p.name.split(" ")[0] || "Arpit";
  const brandEl = document.getElementById("brand-name");
  if (brandEl) brandEl.textContent = brandName;
  
  renderInteractiveName(p.name);

  const taglineEl = document.getElementById("hero-tagline");
  if (taglineEl) taglineEl.textContent = p.tagline;
  
  const bioShortEl = document.getElementById("hero-bio-short");
  if (bioShortEl) bioShortEl.textContent = p.role + " · " + p.experience + " experience";
  
  const aboutBioEl = document.getElementById("about-bio");
  if (aboutBioEl) aboutBioEl.textContent = p.bio;
  
  const heroPhoto = document.getElementById("hero-photo");
  if (heroPhoto) {
    heroPhoto.src = p.photo;
    heroPhoto.alt = p.name;
  }
  
  const frameLabel = document.getElementById("frame-label");
  if (frameLabel) {
    frameLabel.textContent = p.name.toUpperCase() + " — " + p.role.toUpperCase();
  }

  const statsEl = document.getElementById("hero-stats");
  if (statsEl) {
    statsEl.innerHTML = "";
    (p.stats || []).forEach(s => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div>`;
      statsEl.appendChild(div);
    });
  }
}

function renderInteractiveName(fullName) {
  const heroNameEl = document.getElementById("hero-name");
  if (!heroNameEl) return;
  
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  const wrapChars = (str) => {
    return str.split("").map(c => {
      if (c === " ") return " ";
      return `<span class="name-char">${escapeHtml(c)}</span>`;
    }).join("");
  };

  heroNameEl.innerHTML = `
    <span class="name-word">${wrapChars(firstName)}</span>
    ${lastName ? ` <em class="name-word">${wrapChars(lastName)}</em>` : ""}
  `;
}

function renderSoftware(list) {
  const el = document.getElementById("software-list");
  if (!el) return;
  el.innerHTML = "";
  (list || []).forEach((s, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${escapeHtml(s)}</span><span class="tag">0${i + 1}</span>`;
    el.appendChild(li);
    wireLiquidGlassSurface(li);
  });
}

function renderCategories(categories) {
  const el = document.getElementById("filters");
  if (!el) return;
  el.innerHTML = `<button class="filter-btn active" data-cat="all" role="tab" aria-selected="true">All work</button>`;
  categories.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.cat = c.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.textContent = c.name;
    el.appendChild(btn);
  });
  el.addEventListener("click", (e) => {
    const target = e.target.closest(".filter-btn");
    if (!target) return;
    el.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    target.classList.add("active");
    target.setAttribute("aria-selected", "true");
    const data = loadData();
    renderVideos(data.videos, data.categories, target.dataset.cat);
  });
}

function renderVideos(videos, categories, activeCat) {
  const grid = document.getElementById("video-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const list = activeCat === "all" ? videos : videos.filter(v => v.category === activeCat);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-note" style="grid-column:1/-1;">No videos in this category yet — check back soon.</div>`;
    return;
  }

  list.forEach(v => {
    const cat = categories.find(c => c.id === v.category);
    const card = document.createElement("div");
    card.className = "video-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Watch ${v.title}`);
    card.innerHTML = `
      <div class="video-thumb">
        ${v.thumbnail ? `<img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" loading="lazy">` : `<div class="mono" style="color:#666;font-size:.8rem;display:flex;align-items:center;justify-content:center;height:100%;">No thumbnail</div>`}
        <div class="play-badge" aria-hidden="true"><span>▶</span></div>
      </div>
      <div class="video-info">
        <span class="video-cat-tag">${cat ? escapeHtml(cat.name) : "Uncategorized"}</span>
        <h3>${escapeHtml(v.title)}</h3>
        <p>${escapeHtml(v.description || "")}</p>
      </div>
    `;
    card.addEventListener("click", () => openModal(v, cat));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(v, cat);
      }
    });
    
    // Wire Apple Liquid Glass 3D Tilt and Specular Refraction
    wireLiquidGlassCard(card, 7);
    
    grid.appendChild(card);
  });
}

function renderPricing(plans) {
  const el = document.getElementById("pricing-grid");
  if (!el) return;
  el.innerHTML = "";
  plans.forEach(p => {
    const card = document.createElement("div");
    card.className = "price-card" + (p.highlighted ? " highlight" : "");
    card.innerHTML = `
      <div class="price-name">${escapeHtml(p.name)}</div>
      <p class="price-tagline">${escapeHtml(p.tagline || "")}</p>
      <div class="price-amount"><sup>₹</sup>${escapeHtml(p.price)}</div>
      <div class="price-unit">${escapeHtml(p.unit || "")}</div>
      <ul class="price-features">
        ${(p.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join("")}
      </ul>
      <a href="#contact" class="btn ${p.highlighted ? "btn-primary" : "btn-outline"}">Book this</a>
    `;
    
    // Wire Apple Liquid Glass 3D Tilt
    wireLiquidGlassCard(card, 5);
    
    el.appendChild(card);
  });
}

function renderContact(p) {
  const el = document.getElementById("contact-info-list");
  if (!el) return;
  el.innerHTML = `
    <li><span class="lbl">EMAIL</span><a href="mailto:${p.email}">${escapeHtml(p.email)}</a></li>
    <li><span class="lbl">PHONE</span><a href="tel:${p.phone}">${escapeHtml(p.phone)}</a></li>
    <li><span class="lbl">BASED IN</span><span class="val">${escapeHtml(p.location)}</span></li>
  `;
  const social = document.getElementById("social-row");
  if (social) {
    social.innerHTML = "";
    if (p.instagram) social.innerHTML += `<a href="${p.instagram}" target="_blank" rel="noopener">Instagram</a>`;
    if (p.youtube) social.innerHTML += `<a href="${p.youtube}" target="_blank" rel="noopener">YouTube</a>`;
    if (p.linkedin) social.innerHTML += `<a href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`;
  }
}

function wireModal() {
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  if (!overlay || !closeBtn) return;
  
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}

function openModal(video, cat) {
  const overlay = document.getElementById("modal-overlay");
  const body = document.getElementById("modal-video-body");
  if (!overlay || !body) return;
  
  const url = video.videoUrl || "";
  if (/youtube\.com|youtu\.be|player\.vimeo\.com/.test(url)) {
    body.innerHTML = `<iframe src="${url}" title="${escapeHtml(video.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else if (url) {
    body.innerHTML = `<video src="${url}" controls autoplay playsinline></video>`;
  } else {
    body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;">No video source provided</div>`;
  }
  
  const titleEl = document.getElementById("modal-title");
  if (titleEl) titleEl.textContent = video.title;
  
  const descEl = document.getElementById("modal-desc");
  if (descEl) descEl.textContent = video.description || "";
  
  const catEl = document.getElementById("modal-cat");
  if (catEl) catEl.textContent = cat ? cat.name : "";
  
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  const body = document.getElementById("modal-video-body");
  if (body) body.innerHTML = "";
  document.body.style.overflow = "";
}

function wireContactForm(profile) {
  const form = document.getElementById("contact-form");
  const noteEl = document.getElementById("form-note");
  if (!form) return;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const message = document.getElementById("cf-message").value.trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Project Enquiry from ${name} via Portfolio`);
    const body = encodeURIComponent(`${message}\n\n—\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    if (noteEl) {
      noteEl.textContent = "Opening your default email app to send this to " + profile.email + " — click send in your email client.";
      noteEl.style.color = "var(--accent-gold)";
    }
  });
}

function wireMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");
  if (!toggle || !drawer) return;

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !drawer.classList.contains("open");
    if (shouldOpen) {
      toggle.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
    } else {
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
  };

  toggle.addEventListener("click", () => toggleMenu());

  drawer.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

function wireScrollState() {
  const wrapper = document.getElementById("nav-wrapper");
  if (!wrapper) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      wrapper.classList.add("scrolled");
    } else {
      wrapper.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   APPLE LIQUID GLASS INTERACTIVE PHYSICS ENGINE
   ============================================================ */

function initLiquidGlassEngine() {
  initCursorRefractionGlow();
  initHeroImageRefraction();
  initHeroNameMotion();
  initMagneticElements();
  initActiveNavTracker();
  initGlassCardsRefraction();
}

/**
 * Ambient Cursor Refraction Follower
 */
function initCursorRefractionGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let mouseX = -500;
  let mouseY = -500;
  let currentX = -500;
  let currentY = -500;
  let isMoving = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMoving) {
      isMoving = true;
      document.body.classList.add("mouse-active");
      currentX = mouseX;
      currentY = mouseY;
    }
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    document.body.classList.remove("mouse-active");
  });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderGlow);
  }

  requestAnimationFrame(renderGlow);
}

/**
 * 3D Dynamic Tilt & Liquid Refraction on Hero Card
 */
function initHeroImageRefraction() {
  const card = document.getElementById("hero-image-card");
  const glare = document.getElementById("card-glare");
  if (!card) return;

  const onMouseMove = (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotX = (-(mouseY / (rect.height / 2)) * 12).toFixed(2);
    const rotY = ((mouseX / (rect.width / 2)) * 12).toFixed(2);

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glare) {
      const glareX = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const glareY = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35) 0%, rgba(10, 132, 255, 0.15) 30%, transparent 65%)`;
      glare.style.opacity = "1";
    }
  };

  const onMouseEnter = () => {
    card.style.transition = "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease";
  };

  const onMouseLeave = () => {
    card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.3s ease";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (glare) {
      glare.style.opacity = "0";
    }
  };

  card.addEventListener("mousemove", onMouseMove, { passive: true });
  card.addEventListener("mouseenter", onMouseEnter);
  card.addEventListener("mouseleave", onMouseLeave);
}

/**
 * 3D Kinetic Motion on Hero Name
 */
function initHeroNameMotion() {
  const nameEl = document.getElementById("hero-name");
  if (!nameEl) return;

  nameEl.addEventListener("mousemove", (e) => {
    const rect = nameEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const rotX = (-(dy / (rect.height / 2)) * 8).toFixed(2);
    const rotY = ((dx / (rect.width / 2)) * 8).toFixed(2);

    nameEl.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${dx * 0.04}px, ${dy * 0.04}px, 0)`;
  }, { passive: true });

  nameEl.addEventListener("mouseleave", () => {
    nameEl.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
  });
}

/**
 * Wire 3D Tilt & Specular Sheen for Liquid Glass Cards
 */
function wireLiquidGlassCard(card, maxTilt = 7) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const rotX = (-(dy / (rect.height / 2)) * maxTilt).toFixed(2);
    const rotY = ((dx / (rect.width / 2)) * maxTilt).toFixed(2);

    const normX = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const normY = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
    card.style.setProperty("--mouse-x", `${normX}%`);
    card.style.setProperty("--mouse-y", `${normY}%`);
  }, { passive: true });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  });
}

/**
 * Wire subtle liquid glass surface highlight
 */
function wireLiquidGlassSurface(el) {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 60%, transparent 80%)`;
  }, { passive: true });

  el.addEventListener("mouseleave", () => {
    el.style.backgroundImage = "";
  });
}

function initGlassCardsRefraction() {
  document.querySelectorAll(".about-card, .software-card, .contact-card").forEach(card => {
    wireLiquidGlassCard(card, 4);
  });
}

/**
 * Magnetic Pull for Apple Glass Interactive Elements
 */
function initMagneticElements() {
  const magneticEls = document.querySelectorAll(".btn, .nav-cta, .nav-brand, .social-row a");

  magneticEls.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (e.clientX - centerX) * 0.22;
      const dy = (e.clientY - centerY) * 0.22;

      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.03)`;
    }, { passive: true });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate3d(0, 0, 0) scale(1)";
    });
  });
}

/**
 * Active Nav Intersection Observer
 */
function initActiveNavTracker() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a.nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.style.color = "var(--text-primary)";
            link.style.background = "rgba(255, 255, 255, 0.12)";
          } else {
            link.style.color = "";
            link.style.background = "";
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}
