/*=============== FOOTER YEAR ===============*/
const yearEl = document.getElementById('year')
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear())
}

/*=============== FILTERS TABS & 360 INFINITE CAROUSEL ===============*/
const tabsContainer = document.querySelector('.filters__content');
const tabContents = document.querySelectorAll('[data-content]');

if (tabsContainer) {
    // 1. Create Clones for Infinite Loop
    const originalTabs = Array.from(tabsContainer.children);
    const prependFragment = document.createDocumentFragment();
    const appendFragment = document.createDocumentFragment();
    
    // Duplicate tabs to the start and end
    originalTabs.forEach(tab => {
        const prepClone = tab.cloneNode(true);
        prepClone.classList.add('clone-tab');
        prependFragment.appendChild(prepClone);
        
        const appClone = tab.cloneNode(true);
        appClone.classList.add('clone-tab');
        appendFragment.appendChild(appClone);
    });

    tabsContainer.insertBefore(prependFragment, tabsContainer.firstChild);
    tabsContainer.appendChild(appendFragment);

    // 2. Teleportation Logic for Infinite Scroll
    let isScrolling = false;
    
    // Initialize scroll position to the middle (original) segment
    setTimeout(() => {
        const segmentWidth = tabsContainer.scrollWidth / 3;
        // Start precisely in the middle segment
        tabsContainer.scrollLeft = segmentWidth;
        
        tabsContainer.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const currentScroll = tabsContainer.scrollLeft;
                    const singleSegment = tabsContainer.scrollWidth / 3;
                    
                    // If user scrolls too far left, teleport them right
                    if (currentScroll <= 5) {
                        tabsContainer.scrollLeft = currentScroll + singleSegment;
                    } 
                    // If user scrolls too far right, teleport them left
                    else if (currentScroll >= singleSegment * 2 - 5) {
                        tabsContainer.scrollLeft = currentScroll - singleSegment;
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }, 150);

    // 3. Handle Interactions via Event Delegation
    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-target]');
        if (!tab) return;

        const targetId = tab.dataset.target;
        const target = document.querySelector(targetId);

        // Switch content pane
        tabContents.forEach(tc => tc.classList.remove('filters__active'));
        if (target) target.classList.add('filters__active');

        // Update active class on all clones of this tab
        const allTabs = document.querySelectorAll('[data-target]');
        allTabs.forEach(t => t.classList.remove('filter-tab-active'));
        const activeTabs = document.querySelectorAll(`[data-target="${targetId}"]`);
        activeTabs.forEach(t => t.classList.add('filter-tab-active'));

        // Center the clicked tab beautifully
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
}

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

const metaThemeColor = document.querySelector('meta[name="theme-color"]')
function syncThemeColorMeta() {
    if (!metaThemeColor) return
    metaThemeColor.setAttribute(
        'content',
        document.body.classList.contains(darkTheme) ? '#0f172a' : '#f1f5f9'
    )
}
syncThemeColorMeta()

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    syncThemeColorMeta()
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
})

sr.reveal(`.profile__border`)
sr.reveal(`.profile__name`, {delay: 500})
sr.reveal(`.profile__profession`, {delay: 600})
sr.reveal(`.profile__social`, {delay: 700})
sr.reveal(`.profile__info-group`, {interval: 100, delay: 700})
sr.reveal(`.profile__buttons`, {delay: 800})
sr.reveal(`.filters__content`, {delay: 900})
sr.reveal(`.filters`, {delay: 1000})
sr.reveal(`.profile__summary`, {delay: 650})

/*=============== PARTICLE BACKGROUND (index2-style) ===============*/
;(function initParticleBackground() {
  const canvas = document.getElementById('bgCanvas')
  if (!canvas) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduceMotion.matches) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let w = 0
  let h = 0
  const particles = []
  const particleCount = 100
  const connectDist = 150

  function isDark() {
    return document.body.classList.contains('dark-theme')
  }

  function syncSize() {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w
    canvas.height = h
  }

  class Particle {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * w
      this.y = Math.random() * h
      this.size = Math.random() * 2 + 1
      this.speedX = Math.random() * 0.5 - 0.25
      this.speedY = Math.random() * 0.5 - 0.25
      this.opacity = Math.random() * 0.5 + 0.2
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY
      if (this.x > w) this.x = 0
      if (this.x < 0) this.x = w
      if (this.y > h) this.y = 0
      if (this.y < 0) this.y = h
    }

    draw() {
      const dark = isDark()
      const a = dark ? this.opacity : this.opacity * 0.55
      ctx.fillStyle = `rgba(99, 102, 241, ${a})`
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function initParticles() {
    particles.length = 0
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  function connectParticles() {
    const dark = isDark()
    const lineBase = dark ? 0.15 : 0.08
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < connectDist) {
          const alpha = lineBase * (1 - distance / connectDist)
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h)
    particles.forEach((p) => {
      p.update()
      p.draw()
    })
    connectParticles()
    requestAnimationFrame(animate)
  }

  syncSize()
  initParticles()
  animate()

  window.addEventListener('resize', () => {
    syncSize()
    particles.forEach((p) => p.reset())
  })
})()