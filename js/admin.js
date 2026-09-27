const PASS_KEY = "arpit_admin_pass";
const SESSION_KEY = "arpit_admin_session";
let DATA = null;
let editingVideoId = null;
let editingPlanId = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem(PASS_KEY)) localStorage.setItem(PASS_KEY, "arpit123");

  wireLogin();
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    enterDashboard();
  }
});

/* ================= AUTH ================= */
function wireLogin() {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("login-pass").value;
    const stored = localStorage.getItem(PASS_KEY);
    if (pass === stored) {
      sessionStorage.setItem(SESSION_KEY, "1");
      enterDashboard();
    } else {
      document.getElementById("login-error").textContent = "That password isn't right — try again.";
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    document.getElementById("admin-shell").classList.remove("active");
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("login-pass").value = "";
  });
}

function enterDashboard() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-shell").classList.add("active");
  DATA = loadData();
  wireNav();
  renderAllPanels();
}

/* ================= NAV ================= */
function wireNav() {
  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("panel-" + btn.dataset.panel).classList.add("active");
    });
  });
}

function renderAllPanels() {
  renderProfilePanel();
  renderCategoriesPanel();
  renderVideosPanel();
  renderPricingPanel();
}

function persist() {
  saveData(DATA);
  showToast("Saved");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ================= PROFILE ================= */
function renderProfilePanel() {
  const p = DATA.profile;
  const ids = ["name","role","tagline","bio","experience","email","phone","location","instagram","youtube","linkedin"];
  ids.forEach(id => {
    const el = document.getElementById("pf-" + id);
    if (el) el.value = p[id] || "";
  });
  document.getElementById("pf-software").value = (p.software || []).join(", ");
  document.getElementById("pf-photo-preview").src = p.photo;

  const statsWrap = document.getElementById("pf-stats");
  statsWrap.innerHTML = "";
  (p.stats || []).forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "feature-line";
    row.innerHTML = `
      <input type="text" placeholder="Value e.g. 80+" value="${escapeAttr(s.value)}" data-stat-value="${i}">
      <input type="text" placeholder="Label e.g. Projects delivered" value="${escapeAttr(s.label)}" data-stat-label="${i}">
      <button type="button" class="btn-sm danger" data-remove-stat="${i}">Remove</button>
    `;
    statsWrap.appendChild(row);
  });
}

document.addEventListener("submit", (e) => {
  if (e.target.id === "profile-form") {
    e.preventDefault();
    const p = DATA.profile;
    ["name","role","tagline","bio","experience","email","phone","location","instagram","youtube","linkedin"].forEach(id => {
      p[id] = document.getElementById("pf-" + id).value.trim();
    });
    p.software = document.getElementById("pf-software").value.split(",").map(s => s.trim()).filter(Boolean);

    p.stats = [];
    document.querySelectorAll("#pf-stats [data-stat-value]").forEach(input => {
      const i = input.dataset.statValue;
      const label = document.querySelector(`[data-stat-label="${i}"]`).value.trim();
      const value = input.value.trim();
      if (value || label) p.stats.push({ value, label });
    });

    persist();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id === "add-stat-btn") {
    DATA.profile.stats.push({ value: "", label: "" });
    renderProfilePanel();
  }
  if (e.target.dataset.removeStat !== undefined) {
    DATA.profile.stats.splice(Number(e.target.dataset.removeStat), 1);
    renderProfilePanel();
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "pf-photo-file") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      DATA.profile.photo = reader.result;
      document.getElementById("pf-photo-preview").src = reader.result;
      persist();
    };
    reader.readAsDataURL(file);
  }
  if (e.target.id === "video-thumb-file") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("video-thumb-hidden").value = reader.result;
      document.getElementById("video-thumb-preview").src = reader.result;
      document.getElementById("video-thumb-preview").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

/* ================= CATEGORIES ================= */
function renderCategoriesPanel() {
  const tbody = document.getElementById("categories-tbody");
  tbody.innerHTML = "";
  DATA.categories.forEach(c => {
    const count = DATA.videos.filter(v => v.category === c.id).length;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${escapeAttr(c.name)}" data-cat-rename="${c.id}"></td>
      <td>${count} video${count === 1 ? "" : "s"}</td>
      <td class="row-actions">
        <button class="btn-sm danger" data-cat-delete="${c.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  fillCategorySelect();
}

function fillCategorySelect() {
  const sel = document.getElementById("video-category");
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = DATA.categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  if (current) sel.value = current;
}

document.addEventListener("submit", (e) => {
  if (e.target.id === "category-add-form") {
    e.preventDefault();
    const input = document.getElementById("category-name-input");
    const name = input.value.trim();
    if (!name) return;
    DATA.categories.push({ id: uid("cat"), name });
    input.value = "";
    persist();
    renderCategoriesPanel();
    renderVideosPanel();
  }
});

document.addEventListener("change", (e) => {
  if (e.target.dataset.catRename) {
    const cat = DATA.categories.find(c => c.id === e.target.dataset.catRename);
    if (cat) { cat.name = e.target.value.trim() || cat.name; persist(); renderVideosPanel(); }
  }
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.catDelete) {
    const id = e.target.dataset.catDelete;
    const count = DATA.videos.filter(v => v.category === id).length;
    if (count > 0 && !confirm(`${count} video(s) use this category. Delete it anyway? Those videos will show as Uncategorized.`)) return;
    DATA.categories = DATA.categories.filter(c => c.id !== id);
    DATA.videos.forEach(v => { if (v.category === id) v.category = ""; });
    persist();
    renderCategoriesPanel();
    renderVideosPanel();
  }
});

/* ================= VIDEOS ================= */
function renderVideosPanel() {
  fillCategorySelect();
  const tbody = document.getElementById("videos-tbody");
  tbody.innerHTML = "";
  DATA.videos.forEach(v => {
    const cat = DATA.categories.find(c => c.id === v.category);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.thumbnail ? `<img class="thumb-preview" src="${v.thumbnail}">` : `<div class="thumb-preview"></div>`}</td>
      <td>${escapeHtml(v.title)}</td>
      <td>${cat ? escapeHtml(cat.name) : "\u2014"}</td>
      <td class="row-actions">
        <button class="btn-sm" data-video-edit="${v.id}">Edit</button>
        <button class="btn-sm danger" data-video-delete="${v.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  resetVideoForm();
}

function resetVideoForm() {
  editingVideoId = null;
  document.getElementById("video-form-title-label").textContent = "Add a video";
  document.getElementById("video-title").value = "";
  document.getElementById("video-url").value = "";
  document.getElementById("video-desc").value = "";
  document.getElementById("video-thumb-hidden").value = "";
  document.getElementById("video-thumb-preview").style.display = "none";
  document.getElementById("video-thumb-file").value = "";
  fillCategorySelect();
  document.getElementById("video-cancel-edit").style.display = "none";
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.videoEdit) {
    const v = DATA.videos.find(x => x.id === e.target.dataset.videoEdit);
    if (!v) return;
    editingVideoId = v.id;
    document.getElementById("video-form-title-label").textContent = "Edit video";
    document.getElementById("video-title").value = v.title;
    document.getElementById("video-url").value = v.videoUrl;
    document.getElementById("video-desc").value = v.description || "";
    document.getElementById("video-thumb-hidden").value = v.thumbnail || "";
    if (v.thumbnail) {
      document.getElementById("video-thumb-preview").src = v.thumbnail;
      document.getElementById("video-thumb-preview").style.display = "block";
    } else {
      document.getElementById("video-thumb-preview").style.display = "none";
    }
    fillCategorySelect();
    document.getElementById("video-category").value = v.category;
    document.getElementById("video-cancel-edit").style.display = "inline-block";
    document.getElementById("panel-videos").scrollIntoView({ behavior: "smooth" });
  }
  if (e.target.dataset.videoDelete) {
    if (!confirm("Delete this video? This can't be undone.")) return;
    DATA.videos = DATA.videos.filter(v => v.id !== e.target.dataset.videoDelete);
    persist();
    renderVideosPanel();
  }
  if (e.target.id === "video-cancel-edit") {
    resetVideoForm();
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "video-form") {
    e.preventDefault();
    const title = document.getElementById("video-title").value.trim();
    const category = document.getElementById("video-category").value;
    const videoUrl = document.getElementById("video-url").value.trim();
    const description = document.getElementById("video-desc").value.trim();
    const thumbnail = document.getElementById("video-thumb-hidden").value;
    if (!title) return;

    if (editingVideoId) {
      const v = DATA.videos.find(x => x.id === editingVideoId);
      Object.assign(v, { title, category, videoUrl, description, thumbnail });
    } else {
      DATA.videos.push({ id: uid("vid"), title, category, videoUrl, description, thumbnail });
    }
    persist();
    renderVideosPanel();
  }
});

/* ================= PRICING ================= */
function renderPricingPanel() {
  const wrap = document.getElementById("pricing-list");
  wrap.innerHTML = "";
  DATA.pricing.forEach(plan => {
    const card = document.createElement("div");
    card.className = "admin-card";
    card.innerHTML = `
      <h3>${escapeHtml(plan.name)} ${plan.highlighted ? "\u2b50" : ""}</h3>
      <div class="field-row">
        <div class="field"><label>Plan name</label><input type="text" value="${escapeAttr(plan.name)}" data-plan-field="name" data-plan-id="${plan.id}"></div>
        <div class="field"><label>Tagline</label><input type="text" value="${escapeAttr(plan.tagline || "")}" data-plan-field="tagline" data-plan-id="${plan.id}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Price (numbers only, e.g. 6,000)</label><input type="text" value="${escapeAttr(plan.price)}" data-plan-field="price" data-plan-id="${plan.id}"></div>
        <div class="field"><label>Unit (e.g. / video, / month)</label><input type="text" value="${escapeAttr(plan.unit || "")}" data-plan-field="unit" data-plan-id="${plan.id}"></div>
      </div>
      <div class="field">
        <label>Features (one per line)</label>
        <textarea data-plan-field="features" data-plan-id="${plan.id}">${escapeHtml((plan.features || []).join("\n"))}</textarea>
      </div>
      <div class="field" style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" style="width:auto;" ${plan.highlighted ? "checked" : ""} data-plan-field="highlighted" data-plan-id="${plan.id}" id="hl-${plan.id}">
        <label for="hl-${plan.id}" style="margin:0;">Mark as \u201cMost booked\u201d</label>
      </div>
      <div class="row-actions" style="margin-top:10px;">
        <button class="btn-sm primary" data-plan-save="${plan.id}">Save plan</button>
        <button class="btn-sm danger" data-plan-delete="${plan.id}">Delete plan</button>
      </div>
    `;
    wrap.appendChild(card);
  });
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.planSave) {
    const id = e.target.dataset.planSave;
    const plan = DATA.pricing.find(p => p.id === id);
    document.querySelectorAll(`[data-plan-id="${id}"]`).forEach(field => {
      const key = field.dataset.planField;
      if (key === "features") {
        plan.features = field.value.split("\n").map(f => f.trim()).filter(Boolean);
      } else if (key === "highlighted") {
        plan.highlighted = field.checked;
      } else {
        plan[key] = field.value.trim();
      }
    });
    persist();
    renderPricingPanel();
  }
  if (e.target.dataset.planDelete) {
    if (!confirm("Delete this pricing plan?")) return;
    DATA.pricing = DATA.pricing.filter(p => p.id !== e.target.dataset.planDelete);
    persist();
    renderPricingPanel();
  }
  if (e.target.id === "add-plan-btn") {
    DATA.pricing.push({ id: uid("plan"), name: "New Plan", price: "0", unit: "/ video", tagline: "", features: [], highlighted: false });
    persist();
    renderPricingPanel();
  }
});

/* ================= SETTINGS ================= */
document.addEventListener("submit", (e) => {
  if (e.target.id === "password-form") {
    e.preventDefault();
    const current = document.getElementById("current-pass").value;
    const next = document.getElementById("new-pass").value;
    const msgEl = document.getElementById("password-msg");
    if (current !== localStorage.getItem(PASS_KEY)) {
      msgEl.textContent = "Current password is incorrect.";
      msgEl.style.color = "#F26A5A";
      return;
    }
    if (next.length < 4) {
      msgEl.textContent = "New password should be at least 4 characters.";
      msgEl.style.color = "#F26A5A";
      return;
    }
    localStorage.setItem(PASS_KEY, next);
    msgEl.textContent = "Password updated.";
    msgEl.style.color = "var(--amber)";
    e.target.reset();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id === "export-btn") {
    const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-data-backup.json";
    a.click();
  }
  if (e.target.id === "reset-btn") {
    if (!confirm("Reset all content to the original demo content? This can't be undone.")) return;
    DATA = resetData();
    renderAllPanels();
    showToast("Reset to defaults");
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "import-file") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        DATA = Object.assign({}, DATA, imported);
        saveData(DATA);
        renderAllPanels();
        showToast("Backup imported");
      } catch (err) {
        alert("That file doesn't look like a valid backup.");
      }
    };
    reader.readAsText(file);
  }
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}
function escapeAttr(str) { return escapeHtml(str); }
