/* ============================================================
   BEYOND SMILES — Shared Interactions
   ============================================================ */

const WA_NUMBER = "919730021255";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  if (loader){
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hide"), 1400);
    });
    // fallback in case load event is delayed
    setTimeout(() => loader.classList.add("hide"), 2600);
  }

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("bs-theme");
  if (saved) root.setAttribute("data-theme", saved);

  function syncKnob(){
    if (!toggle) return;
    toggle.innerHTML = root.getAttribute("data-theme") === "dark"
      ? '<span class="knob">🌙</span>' : '<span class="knob">☀️</span>';
  }
  syncKnob();

  if (toggle){
    toggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      root.setAttribute("data-theme", isDark ? "light" : "dark");
      localStorage.setItem("bs-theme", isDark ? "light" : "dark");
      syncKnob();
    });
  }

  /* ---------- Navbar scroll ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const navToggle = document.getElementById("navToggle");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("drawerOverlay");
  function closeDrawer(){ drawer?.classList.remove("open"); overlay?.classList.remove("open"); }
  navToggle?.addEventListener("click", () => {
    drawer?.classList.add("open"); overlay?.classList.add("open");
  });
  overlay?.addEventListener("click", closeDrawer);
  drawer?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeDrawer));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const counted = new WeakSet();
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted.has(entry.target)){
        counted.add(entry.target);
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  function animateCount(el){
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.querySelector(".testi-slides");
  if (track){
    const slides = track.querySelectorAll(".testi-slide");
    const dotsWrap = document.querySelector(".testi-dots");
    let idx = 0;
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
    });
    function goTo(i){
      idx = i;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsWrap.querySelectorAll("button").forEach((d, di) => d.classList.toggle("active", di === idx));
    }
    setInterval(() => goTo((idx + 1) % slides.length), 5000);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-q")?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(f => f.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ---------- Booking form -> WhatsApp ---------- */
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm){
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = bookingForm.name.value.trim();
      const phone = bookingForm.phone.value.trim();
      const time = bookingForm.time.value;
      const service = bookingForm.service.value;

      if (!name || !phone || !service){
        alert("Please fill in your name, phone number, and select a service.");
        return;
      }

      const msg = `Hello Beyond Smiles! I'd like to book an appointment.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A*Preferred Time:* ${encodeURIComponent(time || "Any")}`;
      const url = `https://wa.me/${WA_NUMBER}?text=${msg}`;
      window.open(url, "_blank");
    });
  }

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-drawer a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

});
