/* ==========================================================================
   TASK & CO - Award-Winning Animated Freelance Web Studio Interactivity (2026)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Web Audio Sound System
  initSoundSystem();

  // 2. Theme Management (Light / Dark mode - Default: Dark Obsidian)
  initThemeToggle();

  // 2b. Luxury Palette Switcher (Obsidian Bronze vs Coastal Azure)
  initPaletteSwitcher();

  // 3. Interactive Ambient Particle Constellation Canvas (Disabled per user request)
  // initAmbientCanvas();

  // 4. Custom Magnetic Cursor
  initCustomCursor();

  // 5. Designer HUD & Live Local Clock
  initDesignerHUD();

  // 6. Kinetic Dynamic Rotating Headline
  initKineticTypography();

  // 7. Mobile Menu Drawer
  initMobileMenu();

  // 8. Header Scroll Effect & Active Nav Link Observer
  initScrollEffects();

  // 9. Portfolio Filter & Sliding Indicator Pill
  initSlidingFilter();
  initPortfolioFilter();

  // 10. 3D Perspective Card Tilt & Specular Spotlight
  initCardTiltAndSpotlight();

  // 10b. Interactive Before / After Website Redesign Slider
  initBeforeAfterSlider();

  // 11. Interactive Upvote / Heart Counter
  initUpvoteSystem();

  // 12. In-Card Device Viewport Switcher
  initDeviceToggles();

  // 13. Interactive Project Scope & Cost Estimator
  initCostEstimator();

  // 13b. Global Currency Switcher (Both / INR / USD)
  initCurrencySwitcher();

  // 14. Interactive Quick View Demo Modal
  initDemoModal();

  // 15. Scroll Progress Bar & Floating Back-To-Top Ring
  initScrollProgress();

  // 16. Contact Form & WhatsApp Link Generator
  initContactForm();

  // 17. Auto-fill Contact form when clicking demo links
  initDemoCTALinks();
});

/* --------------------------------------------------------------------------
   1. Web Audio API Sound System (Haptic Synth Feedback)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundMuted = true;

function initSoundSystem() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  
  // Check stored sound preference (default: muted)
  const savedSound = localStorage.getItem('taskco_sound');
  if (savedSound === 'unmuted') {
    soundMuted = false;
    if (soundToggleBtn) soundToggleBtn.classList.remove('sound-muted');
  } else {
    soundMuted = true;
    if (soundToggleBtn) soundToggleBtn.classList.add('sound-muted');
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundMuted = !soundMuted;
      localStorage.setItem('taskco_sound', soundMuted ? 'muted' : 'unmuted');
      soundToggleBtn.classList.toggle('sound-muted', soundMuted);
      
      if (!soundMuted) {
        ensureAudioContext();
        playSound('toggle');
      }
    });
  }

  // Add click sound to all interactive buttons
  document.addEventListener('click', (e) => {
    if (soundMuted) return;
    const target = e.target.closest('button, .btn, .calc-tier-option, .calc-addon-pill, .filter-btn');
    if (target && target.id !== 'sound-toggle') {
      playSound('click');
    }
  });
}

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (soundMuted) return;
  try {
    ensureAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      // Soft high-tech blip click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (type === 'toggle') {
      // Pleasant rising tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.085);
    } else if (type === 'success') {
      // Chord arpeggio
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const noteOsc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(audioCtx.destination);
        noteOsc.type = 'sine';
        noteOsc.frequency.value = freq;
        const noteTime = now + (idx * 0.05);
        noteGain.gain.setValueAtTime(0.05, noteTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.12);
        noteOsc.start(noteTime);
        noteOsc.stop(noteTime + 0.13);
      });
    }
  } catch (err) {
    // Silently handle audio context restrictions
  }
}

/* --------------------------------------------------------------------------
   2. Theme Management (Light / Dark)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const htmlRoot = document.documentElement;
  // Fresh light coastal sea-mist default (never plain white)
  htmlRoot.removeAttribute('data-theme');
  localStorage.setItem('taskco_theme', 'light');
}

/* --------------------------------------------------------------------------
   2b. Fresh Light Palette Switcher (Sea-Mist Breeze vs Warm Sand Dune)
   -------------------------------------------------------------------------- */
function initPaletteSwitcher() {
  const paletteToggleBtn = document.getElementById('palette-toggle');
  const paletteBtnText = document.getElementById('palette-btn-text');
  const htmlRoot = document.documentElement;

  const savedPalette = localStorage.getItem('taskco_palette') || 'coastal';
  if (savedPalette === 'sand') {
    htmlRoot.setAttribute('data-palette', 'sand');
    if (paletteBtnText) paletteBtnText.textContent = 'Sand Dune';
  } else {
    htmlRoot.removeAttribute('data-palette');
    if (paletteBtnText) paletteBtnText.textContent = 'Sea-Mist Breeze';
  }

  if (paletteToggleBtn) {
    paletteToggleBtn.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-palette');
      if (current === 'sand') {
        htmlRoot.removeAttribute('data-palette');
        localStorage.setItem('taskco_palette', 'coastal');
        if (paletteBtnText) paletteBtnText.textContent = 'Sea-Mist Breeze';
      } else {
        htmlRoot.setAttribute('data-palette', 'sand');
        localStorage.setItem('taskco_palette', 'sand');
        if (paletteBtnText) paletteBtnText.textContent = 'Sand Dune';
      }
      playSound('toggle');
    });
  }
}

/* --------------------------------------------------------------------------
   3. Interactive Ambient Particle Constellation Canvas
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let isVisible = true;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.45 + 0.2
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  resize();

  function animate() {
    if (!isVisible) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    
    // Dynamically retrieve color palette
    const htmlRoot = document.documentElement;
    const isCoastal = htmlRoot.getAttribute('data-palette') === 'coastal';
    const isDark = htmlRoot.getAttribute('data-theme') === 'dark';

    let particleColor, lineColor;
    if (isCoastal) {
      // Mediterranean Azure & Sand (Image 2)
      particleColor = 'rgba(95, 174, 199, ';
      lineColor = 'rgba(95, 174, 199, ';
    } else if (isDark) {
      // Obsidian Bronze Luxe (Image 1)
      particleColor = 'rgba(197, 146, 101, ';
      lineColor = 'rgba(197, 146, 101, ';
    } else {
      // Warm Silk Linen
      particleColor = 'rgba(181, 122, 70, ';
      lineColor = 'rgba(181, 122, 70, ';
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse proximity repulsion with smooth spring
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.4;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Draw particle with soft glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor + p.baseAlpha + ')';
      ctx.fill();

      // Connect nearby particles with subtle luxury lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   4. Custom Magnetic Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Custom cursor removed per user preference
  return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover expansion on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .project-card, .bento-card, .calc-tier-option, .calc-addon-pill');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });

  // Magnetic button pull
  const magneticButtons = document.querySelectorAll('.btn-magnetic');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   5. Designer HUD & Live Local Clock
   -------------------------------------------------------------------------- */
function initDesignerHUD() {
  const clockEl = document.getElementById('hero-local-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
  }
  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   6. Kinetic Dynamic Rotating Headline
   -------------------------------------------------------------------------- */
function initKineticTypography() {
  const wordEl = document.getElementById('kinetic-text');
  if (!wordEl) return;

  const words = [
    "Local Businesses",
    "Wedding Studios",
    "Contractors & Trades",
    "Fine Dining & Cafés",
    "Boutique Retailers",
    "Specialty Clinics",
    "Real Estate Firms",
    "High-End Brands"
  ];
  let currentIndex = 0;

  setInterval(() => {
    wordEl.classList.add('flip-out');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      wordEl.textContent = words[currentIndex];
      wordEl.classList.remove('flip-out');
      wordEl.classList.add('flip-in');
      void wordEl.offsetWidth; // Trigger reflow
      wordEl.classList.remove('flip-in');
    }, 400);
  }, 3000);
}

/* --------------------------------------------------------------------------
   7. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileToggle || !mobileDrawer) return;

  mobileToggle.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
    const isOpen = mobileDrawer.classList.contains('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   8. Header Scroll Effect & Spy
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy active link
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Sliding Category Filter Pill
   -------------------------------------------------------------------------- */
function initSlidingFilter() {
  const filterPill = document.getElementById('filter-sliding-pill');
  const filterBar = document.getElementById('portfolio-filter-bar');
  if (!filterPill || !filterBar) return;

  function updatePill(activeBtn) {
    if (!activeBtn) return;
    const barRect = filterBar.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const leftOffset = btnRect.left - barRect.left;
    filterPill.style.left = leftOffset + 'px';
    filterPill.style.width = btnRect.width + 'px';
  }

  const activeBtn = filterBar.querySelector('.filter-btn.active');
  if (activeBtn) {
    setTimeout(() => updatePill(activeBtn), 50);
  }

  window.addEventListener('resize', () => {
    const currentActive = filterBar.querySelector('.filter-btn.active');
    updatePill(currentActive);
  });

  window.updateFilterPill = updatePill;
}

/* --------------------------------------------------------------------------
   Portfolio Category Filtering
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (window.updateFilterPill) {
        window.updateFilterPill(btn);
      }

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.98)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. 3D Perspective Card Tilt & Specular Spotlight
   -------------------------------------------------------------------------- */
function initCardTiltAndSpotlight() {
  const tiltCards = document.querySelectorAll('[data-tilt="true"]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* --------------------------------------------------------------------------
   10b. Interactive Before / After Website Redesign Slider
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const slider = document.getElementById('ba-slider');
  if (!slider) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let posX = clientX - rect.left;
    let percentage = (posX / rect.width) * 100;
    // Clamp between 5% and 95%
    percentage = Math.max(5, Math.min(95, percentage));
    slider.style.setProperty('--split-pos', `${percentage}%`);
  }

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
    }
  });

  // Touch support for mobile phones & tablets
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* --------------------------------------------------------------------------
   11. Interactive Upvote / Heart Counter
   -------------------------------------------------------------------------- */
function initUpvoteSystem() {
  const upvoteBtns = document.querySelectorAll('.card-upvote-btn');
  const storedVotes = JSON.parse(localStorage.getItem('taskco_upvotes') || '{}');

  upvoteBtns.forEach(btn => {
    const projectId = btn.getAttribute('data-project');
    const countEl = document.getElementById(`upvote-${projectId}`);

    if (storedVotes[projectId]) {
      if (countEl) countEl.textContent = storedVotes[projectId].count;
      if (storedVotes[projectId].hasVoted) {
        btn.classList.add('upvoted');
      }
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentCount = parseInt(countEl ? countEl.textContent : '100', 10);
      const isUpvoted = btn.classList.contains('upvoted');
      const newCount = isUpvoted ? currentCount - 1 : currentCount + 1;

      btn.classList.toggle('upvoted', !isUpvoted);
      if (!isUpvoted) {
        btn.classList.add('heart-burst');
        setTimeout(() => btn.classList.remove('heart-burst'), 450);
        playSound('success');
      }

      if (countEl) countEl.textContent = newCount;
      storedVotes[projectId] = { count: newCount, hasVoted: !isUpvoted };
      localStorage.setItem('taskco_upvotes', JSON.stringify(storedVotes));
    });
  });
}

/* --------------------------------------------------------------------------
   12. In-Card Device Viewport Switcher
   -------------------------------------------------------------------------- */
function initDeviceToggles() {
  const deviceToggleBtns = document.querySelectorAll('.card-device-btn');

  deviceToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('.project-card');
      if (!card) return;
      const view = btn.getAttribute('data-view');
      const allBtns = card.querySelectorAll('.card-device-btn');
      allBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (view === 'mobile') {
        card.classList.add('preview-mobile-active');
      } else {
        card.classList.remove('preview-mobile-active');
      }
      playSound('click');
    });
  });
}

/* --------------------------------------------------------------------------
   13. Interactive Project Scope & Cost Estimator
   -------------------------------------------------------------------------- */
function initCostEstimator() {
  const calcCard = document.getElementById('project-calculator');
  if (!calcCard) return;

  const baseRadios = calcCard.querySelectorAll('input[name="calc-base"]');
  const addonChecks = calcCard.querySelectorAll('.calc-addon-check');
  const totalDisplay = document.getElementById('calc-total-amount');
  const timelineNote = document.getElementById('calc-timeline-note');
  const waBtn = document.getElementById('calc-whatsapp-btn');

  function calculate() {
    let basePriceUSD = 299;
    let basePriceINR = 24999;
    let baseName = "Starter Express (1 Page)";
    let deliveryDays = "3";

    baseRadios.forEach(radio => {
      const optionLabel = radio.closest('.calc-tier-option');
      if (radio.checked) {
        basePriceUSD = parseInt(radio.getAttribute('data-price') || radio.getAttribute('data-price-usd') || 299, 10);
        basePriceINR = parseInt(radio.getAttribute('data-price-inr') || 24999, 10);
        baseName = radio.getAttribute('data-name');
        deliveryDays = radio.getAttribute('data-days');
        if (optionLabel) optionLabel.classList.add('active');
      } else {
        if (optionLabel) optionLabel.classList.remove('active');
      }
    });

    let addonsUSD = 0;
    let addonsINR = 0;
    const selectedAddons = [];

    addonChecks.forEach(check => {
      const pill = check.closest('.calc-addon-pill');
      if (check.checked) {
        const pUSD = parseInt(check.getAttribute('data-price') || check.getAttribute('data-price-usd') || 0, 10);
        const pINR = parseInt(check.getAttribute('data-price-inr') || 0, 10);
        const name = check.getAttribute('data-addon');
        addonsUSD += pUSD;
        addonsINR += pINR;
        selectedAddons.push(name);
        if (pill) pill.classList.add('active');
      } else {
        if (pill) pill.classList.remove('active');
      }
    });

    const targetUSD = basePriceUSD + addonsUSD;
    const targetINR = basePriceINR + addonsINR;
    const activeCurrency = localStorage.getItem('taskco_currency') || 'both';

    if (totalDisplay) {
      if (activeCurrency === 'inr') {
        totalDisplay.innerHTML = `<span class="calc-currency">₹</span>${targetINR.toLocaleString('en-IN')}`;
      } else if (activeCurrency === 'usd') {
        totalDisplay.innerHTML = `<span class="calc-currency">$</span>${targetUSD}`;
      } else {
        totalDisplay.innerHTML = `<span style="color:var(--accent);">₹${targetINR.toLocaleString('en-IN')}</span> <span style="font-size:0.75em; opacity:0.6; margin:0 4px;">/</span> <span>$${targetUSD} USD</span>`;
      }
    }

    if (timelineNote) {
      timelineNote.innerHTML = `⚡ Estimated Delivery: <strong>${deliveryDays} business days</strong> • 100% Code Ownership`;
    }

    if (waBtn) {
      const addonsText = selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None';
      const msg = `Hi TASK & CO! I configured a custom website estimate on your website:%0A- Foundation: ${encodeURIComponent(baseName)}%0A- Add-Ons: ${encodeURIComponent(addonsText)}%0A- Total Investment: ₹${targetINR.toLocaleString('en-IN')} / $${targetUSD} USD%0AI would like to lock in this package. Are you available this week?`;
      waBtn.href = `https://wa.me/?text=${msg}`;
    }
  }

  window.recalcEstimator = calculate;
  baseRadios.forEach(r => r.addEventListener('change', calculate));
  addonChecks.forEach(c => c.addEventListener('change', calculate));

  calculate();
}

/* --------------------------------------------------------------------------
   13b. Global Currency Switcher (Both / INR / USD)
   -------------------------------------------------------------------------- */
function initCurrencySwitcher() {
  const currencyBtns = document.querySelectorAll('.currency-btn');
  if (!currencyBtns.length) return;

  function setCurrency(mode) {
    localStorage.setItem('taskco_currency', mode);
    currencyBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-curr') === mode);
    });

    document.querySelectorAll('.pricing-inr-tag').forEach(el => {
      el.style.display = (mode === 'usd') ? 'none' : 'inline';
    });
    document.querySelectorAll('.pricing-usd-tag').forEach(el => {
      el.style.display = (mode === 'inr') ? 'none' : 'inline';
    });
    document.querySelectorAll('.pricing-slash').forEach(el => {
      el.style.display = (mode === 'both') ? 'inline' : 'none';
    });

    if (window.recalcEstimator) {
      window.recalcEstimator();
    }
  }

  const savedMode = localStorage.getItem('taskco_currency') || 'both';
  setCurrency(savedMode);

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setCurrency(btn.getAttribute('data-curr'));
      playSound('click');
    });
  });
}

/* --------------------------------------------------------------------------
   14. Interactive Quick View Demo Modal
   -------------------------------------------------------------------------- */
const DEMO_DATA = {
  dining: {
    title: "The Copper Handi & Urban Roasters",
    industry: "Food & Hospitality",
    note: "Engineered for high conversion: live visual menu, 1-click WhatsApp order bag & instant table reservations.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(197, 146, 101, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#ded7cf; letter-spacing:0.04em;">🥘 THE COPPER HANDI & URBAN ROASTERS</div>
            <div style="font-size:0.75rem; color:#c59265;">HERITAGE HANDI RECIPES • ARTISAN CAFÉ COLD BREWS</div>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#f39c12; background:rgba(243,156,18,0.12); padding:3px 10px; border-radius:999px; border:1px solid rgba(243,156,18,0.25);">★ 4.9 (420+ Reviews)</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(217, 119, 6, 0.3); border-radius:10px; padding:18px; margin-bottom:18px;">
          <span style="font-size:0.72rem; font-weight:800; color:#f59e0b; text-transform:uppercase; letter-spacing:0.06em;">⚡ Table Booking Engine Active</span>
          <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:4px 0 8px;">Authentic Slow-Cooked Biryanis & Tandoor Grills</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">Browse the interactive digital menu, customize your takeaway order bag, or reserve a table with instant WhatsApp confirmation.</p>
          <div style="display:flex; gap:10px;">
            <a href="demo-dining.html" target="_blank" style="background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:7px; text-decoration:none;">Reserve Table Online →</a>
            <a href="demo-dining.html#menu" target="_blank" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#ded7cf; font-weight:600; font-size:0.84rem; padding:9px 18px; border-radius:7px; text-decoration:none;">View Digital Menu</a>
          </div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:18px;">
          <div style="background:#0e1620; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-weight:700; font-size:0.88rem; color:#f59e0b;">Dum Handi Biryani</div>
            <div style="font-size:0.76rem; color:#9c979d; margin:3px 0 6px;">Slow cooked in sealed clay pots</div>
            <div style="font-weight:800; font-size:0.82rem; color:#ded7cf;">₹420 / $18.50</div>
          </div>
          <div style="background:#0e1620; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-weight:700; font-size:0.88rem; color:#f59e0b;">Woodfired Tandoori</div>
            <div style="font-size:0.76rem; color:#9c979d; margin:3px 0 6px;">Marinated 24h in house spices</div>
            <div style="font-weight:800; font-size:0.82rem; color:#ded7cf;">₹360 / $16.00</div>
          </div>
          <div style="background:#0e1620; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-weight:700; font-size:0.88rem; color:#f59e0b;">Smoked Cold Brew</div>
            <div style="font-size:0.76rem; color:#9c979d; margin:3px 0 6px;">Artisan single origin roast</div>
            <div style="font-weight:800; font-size:0.82rem; color:#ded7cf;">₹150 / $6.50</div>
          </div>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-dining.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (The Copper Handi)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  salon: {
    title: "Luxe & Blade Studio & Day Spa",
    industry: "Personal Care & Fitness",
    note: "Modern appointments portal: stylist portfolios, service pricing tiers & 1-click booking.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(236, 72, 153, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#ded7cf;">✂️ LUXE & BLADE STUDIO & SPA</div>
            <div style="font-size:0.75rem; color:#f472b6;">MASTER BARBERS • AYURVEDIC SCALP CARE • VIP LOUNGE</div>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#f472b6; background:rgba(244,114,182,0.12); padding:3px 10px; border-radius:999px;">★ 4.95 Rating</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(236, 72, 153, 0.3); border-radius:10px; padding:18px; margin-bottom:18px;">
          <span style="font-size:0.72rem; font-weight:800; color:#f472b6; text-transform:uppercase;">⚡ 3-Step Appointment Booker Active</span>
          <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:4px 0 8px;">Precision Grooming & Botanical Rejuvenation</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">Select your preferred stylist or spa specialist, choose your service package, and receive instant WhatsApp appointment confirmation.</p>
          <a href="demo-salon.html" target="_blank" style="background:linear-gradient(135deg, #db2777, #be185d); color:#ffffff; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:7px; text-decoration:none; display:inline-block;">Select Specialist & Book Online ↗</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-salon.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (Luxe & Blade)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  contractor: {
    title: "ProCraft Trades & Contracting",
    industry: "Trades & Contractors",
    note: "High-trust local lead engine with 24/7 emergency dispatch, trade badges, and cost estimator.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(239, 68, 68, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); padding:10px 16px; border-radius:8px; margin-bottom:18px;">
          <div style="font-weight:800; color:#f87171; font-size:0.88rem;">🚨 24/7 EMERGENCY ELECTRICAL & PLUMBING DISPATCH</div>
          <a href="tel:5550192831" style="background:#dc2626; color:#fff; font-weight:700; padding:6px 14px; border-radius:6px; font-size:0.82rem; text-decoration:none;">📞 (555) 019-2831</a>
        </div>
        <div style="margin-bottom:18px;">
          <h3 style="font-size:1.4rem; font-weight:800; color:#ffffff; margin-bottom:8px;">Licensed Master Contractors You Can Trust</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">Bonded, insured, and serving a 25-mile local radius. Upfront pricing before any work starts with zero hidden trip fees.</p>
          <div style="display:flex; gap:8px;">
            <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:4px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">✓ 30-Min Emergency Response</span>
            <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:4px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">✓ 100% Code Compliance Guarantee</span>
            <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:4px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">✓ Free Estimates</span>
          </div>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-contractor.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (ProCraft)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  retail: {
    title: "Khaadi & Silk Artisan Apparel",
    industry: "Retail & Real Estate",
    note: "Editorial luxury lookbook layout with direct WhatsApp inventory holds and size guide.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(197, 146, 101, 0.25);">
        <div style="text-align:center; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
          <div style="font-weight:800; font-size:1.25rem; letter-spacing:0.15em; color:#ded7cf;">KHAADI & SILK</div>
          <div style="font-size:0.75rem; color:#c59265; letter-spacing:0.08em;">ARTISAN APPAREL & CURATED WARES</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(244, 114, 182, 0.12) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(244, 114, 182, 0.25); border-radius:10px; padding:18px; margin-bottom:18px; text-align:center;">
          <span style="font-size:0.72rem; font-weight:800; color:#f472b6; letter-spacing:0.08em;">SPRING CAPSULE DROP</span>
          <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin:4px 0 8px;">Handcrafted in Natural French Linens & Silks</h3>
          <p style="font-size:0.86rem; color:#9c979d; margin-bottom:12px;">Limited run available for in-store boutique tryouts or direct WhatsApp hold.</p>
          <a href="demo-retail.html" target="_blank" style="background:#10b981; color:#fff; font-weight:700; font-size:0.84rem; padding:8px 18px; border-radius:999px; text-decoration:none;">Browse Full Capsule Drop →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-retail.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (Khaadi & Silk)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  fitness: {
    title: "IronPulse Performance Club",
    industry: "Personal Care & Fitness",
    note: "High-energy member transformation showcase, class schedule, and trial pass lead engine.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(234, 179, 8, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
          <div style="font-weight:800; font-size:1.15rem; color:#facc15;">⚡ IRONPULSE PERFORMANCE CLUB</div>
          <div style="font-size:0.75rem; color:#9c979d;">STRENGTH • HYROX • RECOVERY</div>
        </div>
        <div style="background:rgba(234,179,8,0.12); border:1px solid rgba(234,179,8,0.3); border-radius:10px; padding:18px; text-align:center; margin-bottom:18px;">
          <span style="font-size:0.72rem; font-weight:800; color:#facc15; text-transform:uppercase;">First 20 Signups Only</span>
          <h3 style="font-size:1.35rem; font-weight:800; color:#fff; margin:4px 0 8px;">Claim Your Free 3-Day VIP All-Access Pass</h3>
          <p style="font-size:0.86rem; color:#9c979d; margin-bottom:14px;">Experience small group coaching, body composition analysis, and custom programming at zero cost.</p>
          <a href="demo-fitness.html" target="_blank" style="background:#eab308; color:#000; font-weight:800; font-size:0.85rem; padding:10px 22px; border-radius:6px; text-decoration:none;">Claim VIP Pass Now →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-fitness.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (IronPulse)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  healthcare: {
    title: "CareFirst Family Clinic & Pet Care",
    industry: "Clinics, Events & Photo",
    note: "Trust-forward layout with insurance checker, emergency appointments, and online booking.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(20, 184, 166, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#5eead4;">🩺 CAREFIRST CLINIC & VET CARE</div>
            <div style="font-size:0.75rem; color:#9c979d;">FAMILY HEALTHCARE • DENTAL CLINIC • ANIMAL HOSPITAL</div>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#5eead4;">★ 4.9 (240+ Reviews)</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(20, 184, 166, 0.3); border-radius:10px; padding:18px; margin-bottom:18px;">
          <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:8px;">Gentle & Modern Family Care with Zero Wait</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">All major insurance plans accepted. Same-day emergency appointments for dental pain, general medicine, and pet wellness.</p>
          <a href="demo-healthcare.html" target="_blank" style="background:#0d9488; color:#fff; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:6px; text-decoration:none;">Book Appointment Online →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-healthcare.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (CareFirst)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  realestate: {
    title: "Aura Luxury Realty — Marcus Vance",
    industry: "Retail & Real Estate",
    note: "Equipped with luxury property highlight cards, virtual tour bookings, and valuation lead magnet.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(56, 189, 248, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#7dd3fc;">🏛️ AURA LUXURY REALTY</div>
            <div style="font-size:0.75rem; color:#9c979d;">Marcus Vance • Top 1% Producer • Over $45M Sold</div>
          </div>
          <div style="font-weight:800; font-size:1.1rem; color:#c59265;">₹10.4 Cr / $1,250,000</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(56, 189, 248, 0.3); border-radius:10px; padding:18px; margin-bottom:18px;">
          <span style="font-size:0.72rem; font-weight:800; color:#38bdf8; text-transform:uppercase;">FEATURED EXCLUSIVE ESTATE</span>
          <h3 style="font-size:1.3rem; font-weight:700; color:#ffffff; margin:4px 0 8px;">842 Sunset Ridge Crest, Bel Air</h3>
          <p style="font-size:0.86rem; color:#9c979d; margin-bottom:12px;">Contemporary 4 bed, 4 bath estate with chef's kitchen, heated infinity pool, and panoramic mountain views.</p>
          <a href="demo-realestate.html" target="_blank" style="background:#0284c7; color:#fff; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:6px; text-decoration:none;">Schedule Showing & View 3D Tour →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-realestate.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (Aura Realty)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  photography: {
    title: "AURORA & CO. — Weddings & Fine Art",
    industry: "Clinics, Events & Photo",
    note: "Engineered for high emotional appeal, full-res photo clarity, and bride inquiries.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(222, 215, 207, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#ded7cf;">📷 AURORA & CO.</div>
            <div style="font-size:0.75rem; color:#9c979d;">EDITORIAL DESTINATION WEDDINGS & FINE ART</div>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#c59265;">2026/2027 Calendar Open</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(222, 215, 207, 0.08) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(222, 215, 207, 0.2); border-radius:10px; padding:18px; margin-bottom:18px; text-align:center;">
          <h3 style="font-size:1.35rem; font-weight:700; color:#ffffff; font-style:italic; margin-bottom:8px;">"Timeless heirloom stories captured in pure natural light."</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">Full-day coverage, online proofs gallery, high-res download rights, and heirloom album design.</p>
          <a href="demo-photography.html" target="_blank" style="background:rgba(222, 215, 207, 0.2); border:1px solid rgba(222, 215, 207, 0.4); color:#ded7cf; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:6px; text-decoration:none;">Check Your Wedding Date →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-photography.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (Aurora & Co.)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  education: {
    title: "BrightPath Academy & Social Foundation",
    industry: "Education, NGOs & Industry",
    note: "Next-gen education portal: interactive course catalog, counselor booking & free syllabus download.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(16, 185, 129, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#6ee7b7;">🎓 BRIGHTPATH ACADEMY</div>
            <div style="font-size:0.75rem; color:#9c979d;">1,250+ GRADUATED • STEM & CAREER PATHWAYS</div>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#10b981;">Admissions Open</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:18px; margin-bottom:18px;">
          <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:8px;">Robotics, Advanced Coding & Competitive Exam Prep</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">Download curriculum outlines, book a 1-on-1 counseling session, or apply for foundation community scholarships.</p>
          <a href="demo-education.html" target="_blank" style="background:#059669; color:#fff; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:6px; text-decoration:none;">Download Syllabus & Counselor Booking →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-education.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (BrightPath)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  },
  industrial: {
    title: "Vertex Precision Industrial Manufacturing",
    industry: "Education, NGOs & Industry",
    note: "B2B credibility engine with technical certifications, spec downloads, and fast RFQ quotes.",
    render: () => `
      <div style="background: #15222e; color: #ded7cf; border-radius: 14px; padding: 24px; border: 1px solid rgba(59, 130, 246, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="font-weight:800; font-size:1.15rem; color:#93c5fd;">⚙️ VERTEX PRECISION MANUFACTURING</div>
            <div style="font-size:0.75rem; color:#9c979d;">ISO 9001:2015 & AS9100D CERTIFIED FACILITY</div>
          </div>
          <div style="font-size:0.78rem; font-weight:700; color:#60a5fa;">24h RFQ Portal Active</div>
        </div>
        <div style="background:linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 22, 32, 0.95) 100%); border:1px solid rgba(59, 130, 246, 0.3); border-radius:10px; padding:18px; margin-bottom:18px;">
          <h3 style="font-size:1.35rem; font-weight:800; color:#ffffff; margin-bottom:8px;">High-Precision CNC Machining & Valve Assemblies</h3>
          <p style="font-size:0.88rem; color:#9c979d; margin-bottom:14px;">Supplying global Tier-1 automotive, aerospace, and energy markets with tight tolerance parts (up to ±0.002mm) and full material traceability.</p>
          <a href="demo-industrial.html" target="_blank" style="background:#2563eb; color:#fff; font-weight:700; font-size:0.84rem; padding:9px 18px; border-radius:6px; text-decoration:none;">Submit B2B RFQ Specification →</a>
        </div>
        <div style="text-align:center; padding-top:4px;">
          <a href="demo-industrial.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #c59265 0%, #a87348 100%); color:#ffffff; font-weight:700; font-size:0.92rem; padding:12px 24px; border-radius:8px; text-decoration:none; box-shadow:0 4px 14px rgba(197, 146, 101, 0.35);">
            <span>🚀 Open Full Standalone Demo Website (Vertex Industrial)</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    `
  }
};

// Backward-compatibility aliases
DEMO_DATA.photographer = DEMO_DATA.photography;
DEMO_DATA.electrician = DEMO_DATA.contractor;
DEMO_DATA.boutique = DEMO_DATA.retail;
DEMO_DATA.gym = DEMO_DATA.fitness;
DEMO_DATA.dental = DEMO_DATA.healthcare;
DEMO_DATA.manufacturer = DEMO_DATA.industrial;

function initDemoModal() {
  const backdrop = document.getElementById('demo-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-dismiss-btn');
  const modalCtaBtn = document.getElementById('modal-cta-btn');
  const demoTitle = document.getElementById('modal-demo-title');
  const industryTag = document.getElementById('modal-industry-tag');
  const featuresNote = document.getElementById('modal-features-note');
  const dynamicContent = document.getElementById('modal-dynamic-content');
  const demoViewport = document.getElementById('demo-viewport');
  const deviceBtns = document.querySelectorAll('.modal-device-btn');

  const previewButtons = document.querySelectorAll('.preview-demo-btn, .quick-view-btn');

  function openModal(demoKey) {
    const data = DEMO_DATA[demoKey] || DEMO_DATA.photographer;
    demoTitle.textContent = data.title;
    industryTag.textContent = data.industry;
    featuresNote.textContent = data.note;
    dynamicContent.innerHTML = data.render();

    modalCtaBtn.setAttribute('data-target-industry', data.industry);

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playSound('toggle');
  }

  function closeModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playSound('click');
  }

  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoKey = btn.getAttribute('data-demo');
      openModal(demoKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const device = btn.getAttribute('data-device');
      demoViewport.className = `demo-preview-viewport viewport-${device}`;
      playSound('click');
    });
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', () => {
      const targetIndustry = modalCtaBtn.getAttribute('data-target-industry');
      closeModal();
      if (targetIndustry) {
        setTimeout(() => {
          preselectIndustry(targetIndustry);
        }, 300);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   15. Scroll Progress Bar & Floating Back-To-Top Ring
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('floating-back-to-top');
  const progressCircle = document.getElementById('progress-circle');

  const circumference = 125.6; // 2 * Math.PI * 20

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
    const percentage = Math.min(Math.max(progress * 100, 0), 100);

    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }

    if (progressCircle) {
      const offset = circumference - (circumference * progress);
      progressCircle.style.strokeDashoffset = Math.max(offset, 0);
    }

    if (backToTopBtn) {
      if (window.scrollY > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSound('click');
    });
  }
}

/* --------------------------------------------------------------------------
   16. Contact Form & WhatsApp Link Generator
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('project-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('client-name');
    const phoneInput = document.getElementById('client-phone');
    const bizInput = document.getElementById('client-biz-name');
    const industrySelect = document.getElementById('client-industry');
    const needsTextarea = document.getElementById('client-needs');

    const clientName = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const bizName = bizInput.value.trim();
    const industry = industrySelect.value;
    const notes = needsTextarea.value.trim();

    if (!clientName || !phone || !bizName || !industry) {
      alert('Please fill in your name, phone number, business name, and industry so I can create your mockup.');
      return;
    }

    showToast(`Thank you, ${clientName}! Your mockup request for "${bizName}" has been received. I'll get back to you shortly!`);
    playSound('success');

    form.reset();
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

/* --------------------------------------------------------------------------
   17. Auto-fill Contact form when clicking demo links
   -------------------------------------------------------------------------- */
function initDemoCTALinks() {
  const demoLinks = document.querySelectorAll('.demo-link-btn');

  demoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        return;
      }
      const industry = link.getAttribute('data-industry');
      if (industry) {
        preselectIndustry(industry);
      }
    });
  });
}

function preselectIndustry(industryName) {
  const industrySelect = document.getElementById('client-industry');
  if (!industrySelect) return;

  for (let i = 0; i < industrySelect.options.length; i++) {
    const opt = industrySelect.options[i];
    if (opt.value.toLowerCase().includes(industryName.toLowerCase()) || 
        opt.text.toLowerCase().includes(industryName.toLowerCase())) {
      industrySelect.selectedIndex = i;
      break;
    }
  }

  const formContainer = document.querySelector('.contact-form-container');
  if (formContainer) {
    formContainer.style.boxShadow = '0 0 0 3px var(--accent)';
    setTimeout(() => {
      formContainer.style.boxShadow = '';
    }, 2000);
  }
}
