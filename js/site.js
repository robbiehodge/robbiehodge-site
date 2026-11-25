/* ==========================================================================
   robbiehodge.com v2.0 - Shared Interactive Layer
   Handles nav scroll state, mobile drawer, live Charlotte clock, scroll reveals,
   accessible reduced-motion guards, and inner-page champagne particle + cursor.
   ========================================================================== */
(function () {
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  // 1. Live Charlotte, NC clock
  function updateClock() {
    var el = document.getElementById('cltClock');
    if (!el) return;
    var now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Nav scroll state
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3. Mobile navigation drawer
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileDrawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.innerHTML = open ? '&#10005;' : '&#9776;';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
      });
    });
  }

  // 4. Scroll reveal observer
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
    } else {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      reveals.forEach(function (el) { obs.observe(el); });
    }
  }

  // 5. Inner-page champagne cursor & subtle particle network
  if (prefersReduced) return;

  if (isFinePointer && !document.getElementById('cursor')) {
    var dot = document.createElement('div');
    dot.className = 'site-cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'site-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = (mx - 3.5) + 'px';
      dot.style.top = (my - 3.5) + 'px';
    }, { passive: true });

    (function loopRing() {
      if (!document.hidden) {
        rx += (mx - rx - 16) * 0.14;
        ry += (my - ry - 16) * 0.14;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      requestAnimationFrame(loopRing);
    })();

    document.querySelectorAll('a, button, .desk-card, .post-card, .service-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.style.transform = 'scale(2.1)';
        ring.style.transform = 'scale(1.45)';
        ring.style.borderColor = 'rgba(216, 195, 158, 0.85)';
      });
      el.addEventListener('mouseleave', function () {
        dot.style.transform = 'scale(1)';
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'rgba(216, 195, 158, 0.45)';
      });
    });
  }

  // Lightweight particle field on inner pages without an existing background canvas
  if (!document.querySelector('canvas')) {
    var canvas = document.createElement('canvas');
    canvas.id = 'siteParticles';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');
    var pts = [];
    var count = window.innerWidth < 768 ? 18 : 34;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (var i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6
      });
    }

    (function draw() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(216, 195, 158, 0.38)';
          ctx.fill();
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j];
            var dx = p.x - q.x, dy = p.y - q.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 130) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = 'rgba(216, 195, 158,' + ((1 - d / 130) * 0.12).toFixed(3) + ')';
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }
})();
