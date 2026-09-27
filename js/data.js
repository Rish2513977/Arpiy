/* ============================================================
   DATA LAYER
   Everything the site shows (about text, categories, videos,
   pricing plans, contact info) lives in localStorage under the
   key "arpit_portfolio_v1". The admin dashboard writes to it,
   the public site reads from it. If nothing is stored yet, the
   DEFAULT_DATA below is used to seed the site on first load.
   ============================================================ */

const STORAGE_KEY = "arpit_portfolio_v1";

const DEFAULT_DATA = {
  profile: {
    name: "Arpit Yadav",
    role: "Video Editor",
    tagline: "Cuts that keep people watching.",
    bio: "I'm a video editor with 2+ years behind the timeline, cutting everything from brand ads and YouTube long-form to reels and motion-graphics explainers. I work mainly in Adobe Premiere Pro for editing and Adobe After Effects for motion graphics and VFX \u2014 built to take a raw folder of footage and hand back something that holds attention.",
    software: ["Adobe Premiere Pro", "Adobe After Effects"],
    experience: "2+ Years",
    email: "arpit.yadav.edits@gmail.com",
    phone: "+91 98765 43210",
    location: "India",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
    photo: "images/arpit.jpg",
    stats: [
      { label: "Years cutting", value: "2+" },
      { label: "Projects delivered", value: "80+" },
      { label: "Happy clients", value: "40+" }
    ]
  },
  categories: [
    { id: "cat-1", name: "Reels & Shorts" },
    { id: "cat-2", name: "YouTube Long-form" },
    { id: "cat-3", name: "Brand & Ads" },
    { id: "cat-4", name: "Motion Graphics" }
  ],
  videos: [
    {
      id: "vid-1",
      title: "Summer Drop \u2014 Product Reel",
      category: "cat-1",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "images/thumb-product-reel.jpg",
      description: "Fast-paced vertical cut for a product launch, synced to the beat drop."
    },
    {
      id: "vid-2",
      title: "Founder Story \u2014 Long-form Interview",
      category: "cat-2",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "images/thumb-interview.jpg",
      description: "20-minute interview trimmed to a tight 9-minute narrative with lower-thirds and b-roll."
    },
    {
      id: "vid-3",
      title: "Streetwear Campaign",
      category: "cat-3",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "images/thumb-streetwear.jpg",
      description: "30-second brand spot, color graded in Premiere with custom LUTs."
    },
    {
      id: "vid-4",
      title: "Logo Reveal \u2014 Motion Study",
      category: "cat-4",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "images/thumb-motion-logo.jpg",
      description: "After Effects logo animation with particle build-up and glass refraction."
    }
  ],
  pricing: [
    {
      id: "plan-1",
      name: "Reel Cut",
      price: "1,500",
      unit: "/ video",
      tagline: "Short-form for Instagram, YouTube Shorts & TikTok",
      features: [
        "Up to 60 seconds",
        "2 rounds of revisions",
        "Captions & basic sound design",
        "48-hour turnaround"
      ],
      highlighted: false
    },
    {
      id: "plan-2",
      name: "Full Video",
      price: "6,000",
      unit: "/ video",
      tagline: "YouTube long-form or brand video",
      features: [
        "Up to 15 minutes",
        "3 rounds of revisions",
        "Color grading & sound design",
        "Motion graphics on request",
        "4\u20135 day turnaround"
      ],
      highlighted: true
    },
    {
      id: "plan-3",
      name: "Monthly Retainer",
      price: "20,000",
      unit: "/ month",
      tagline: "Ongoing content for creators & brands",
      features: [
        "Up to 8 videos / month",
        "Priority turnaround",
        "Dedicated Premiere project",
        "Unlimited minor revisions"
      ],
      highlighted: false
    }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveData(DEFAULT_DATA);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    const parsed = JSON.parse(raw);
    // Merge missing thumbnails from default demo data if empty
    if (parsed.videos && Array.isArray(parsed.videos)) {
      parsed.videos.forEach(v => {
        if (!v.thumbnail) {
          const def = DEFAULT_DATA.videos.find(dv => dv.id === v.id);
          if (def && def.thumbnail) v.thumbnail = def.thumbnail;
        }
      });
    }
    // fill in any missing top-level keys from defaults (safety for older saves)
    return Object.assign({}, DEFAULT_DATA, parsed);
  } catch (e) {
    console.error("Could not read saved data, falling back to defaults.", e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Could not save data.", e);
    return false;
  }
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return loadData();
}

function uid(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
