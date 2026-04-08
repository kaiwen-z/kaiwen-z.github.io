(function () {
      document.querySelectorAll('#projects .project-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('a')) return;
          var primary = card.querySelector('a.project-link.primary-link');
          if (!primary) return;
          var href = primary.getAttribute('href');
          if (!href) return;
          if (primary.getAttribute('target') === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = href;
          }
        });
      });
    })();

(function () {
      function prefersReducedMotion() {
        var fxOff = window.__fxEnabled === false;
        return fxOff || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      }

      function resetToTopAndDisableRestore() {
        try {
          if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        } catch (e) {}

        // Preserve intentional deep links (e.g. index.html#projects from other pages).
        if (window.location.hash) return;

        // Do the actual reset after the browser has had a chance to restore.
        window.setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0);
      }

      function ensureExplosionLayer(btn) {
        var existing = btn.querySelector('.btn-explosion-layer');
        if (existing) return existing;
        var layer = document.createElement('span');
        layer.className = 'btn-explosion-layer';
        btn.appendChild(layer);
        return layer;
      }

      function ensureGlobalExplosionLayer() {
        var existing = document.getElementById('global-btn-explosion-layer');
        if (existing) return existing;
        var layer = document.createElement('span');
        layer.id = 'global-btn-explosion-layer';
        layer.className = 'btn-explosion-layer is-global';
        document.body.appendChild(layer);
        return layer;
      }

      function explode(btn) {
        if (prefersReducedMotion()) return;
        var layer = ensureExplosionLayer(btn);
        var globalLayer = ensureGlobalExplosionLayer();

        var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var topLeftReach = Math.sqrt(vw * vw + vh * vh) * 1.05;

        // Cinematic gamma rays launching from the bottom of the screen.
        var beamCount = 22;
        for (var i = 0; i < beamCount; i++) {
          var beam = document.createElement('span');
          beam.className = 'btn-explosion-particle is-beam';
          beam.style.left = (68 + Math.random() * 28).toFixed(2) + '%';
          beam.style.top = (92 + Math.random() * 8).toFixed(2) + '%';

          var targetX = (22 + Math.random() * 30) / 100 * vw;
          var targetY = -(0.90 + Math.random() * 1.20) * vh;
          var originX = parseFloat(beam.style.left) / 100 * vw;
          var originY = parseFloat(beam.style.top) / 100 * vh;
          var dxB = targetX - originX;
          var dyB = targetY - originY;
          // normalize to long travel so they cross the viewport fully
          var mag = Math.max(1, Math.sqrt(dxB * dxB + dyB * dyB));
          var scale = topLeftReach / mag;
          dxB *= scale;
          dyB *= scale;

          var a = Math.atan2(dyB, dxB);
          var rot = (a * 180) / Math.PI + 90;
          var h = 150 + Math.random() * 260;
          var w = 1.8 + Math.random() * 2.8;
          var dur = 260 + Math.random() * 260;

          beam.style.setProperty('--dx', dxB.toFixed(1) + 'px');
          beam.style.setProperty('--dy', dyB.toFixed(1) + 'px');
          beam.style.setProperty('--rot', rot.toFixed(1) + 'deg');
          beam.style.setProperty('--h', h.toFixed(0) + 'px');
          beam.style.setProperty('--w', w.toFixed(1) + 'px');
          beam.style.setProperty('--dur', dur.toFixed(0) + 'ms');

          globalLayer.appendChild(beam);

          (function (node) {
            window.setTimeout(function () {
              if (node && node.parentNode) node.parentNode.removeChild(node);
            }, 900);
          })(beam);
        }

        // Local burst of light particles from the button itself.
        var emberCount = 34;
        for (var j = 0; j < emberCount; j++) {
          var ember = document.createElement('span');
          ember.className = 'btn-explosion-particle';
          ember.style.left = '50%';
          ember.style.top = '50%';
          ember.style.background = 'rgba(255, 220, 180, 0.96)';
          ember.style.boxShadow = '0 0 18px rgba(255, 220, 180, 0.42), 0 0 24px rgba(120,220,255,0.24)';

          var a2 = Math.random() * Math.PI * 2;
          var dist2 = 90 + Math.random() * 170;
          var dxE = Math.cos(a2) * dist2;
          var dyE = Math.sin(a2) * dist2;
          var s2 = 0.6 + Math.random() * 1.0;
          var dur2 = 220 + Math.random() * 260;

          ember.style.setProperty('--dx', dxE.toFixed(1) + 'px');
          ember.style.setProperty('--dy', dyE.toFixed(1) + 'px');
          ember.style.setProperty('--s', s2.toFixed(2));
          ember.style.setProperty('--dur', dur2.toFixed(0) + 'ms');

          layer.appendChild(ember);

          (function (node) {
            window.setTimeout(function () {
              if (node && node.parentNode) node.parentNode.removeChild(node);
            }, 700);
          })(ember);
        }

        var smokeCount = 14;
        for (var k = 0; k < smokeCount; k++) {
          var smoke = document.createElement('span');
          smoke.className = 'btn-explosion-particle is-smoke';
          smoke.style.left = '50%';
          smoke.style.top = '50%';

          var a3 = Math.random() * Math.PI * 2;
          var dist3 = 80 + Math.random() * 120;
          var dxS = Math.cos(a3) * dist3;
          var dyS = Math.sin(a3) * dist3;
          var sz = 22 + Math.random() * 28;
          var dur3 = 420 + Math.random() * 360;

          smoke.style.setProperty('--dx', dxS.toFixed(1) + 'px');
          smoke.style.setProperty('--dy', dyS.toFixed(1) + 'px');
          smoke.style.setProperty('--sz', sz.toFixed(0) + 'px');
          smoke.style.setProperty('--dur', dur3.toFixed(0) + 'ms');
          smoke.style.setProperty('--s', (0.9 + Math.random() * 0.7).toFixed(2));

          layer.appendChild(smoke);

          (function (node) {
            window.setTimeout(function () {
              if (node && node.parentNode) node.parentNode.removeChild(node);
            }, 1100);
          })(smoke);
        }
      }

      function press(btn) {
        if (window.__fxEnabled === false) return;
        btn.classList.remove('is-pressing');
        // Force reflow so the animation restarts reliably
        void btn.offsetWidth;
        btn.classList.add('is-pressing');
        explode(btn);
        window.setTimeout(function () {
          btn.classList.remove('is-pressing');
        }, 500);
      }

      function safeScrollToProjects() {
        var projects = document.getElementById('projects');
        if (!projects) return;
        projects.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }

      window.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('view-projects-btn');
        if (!btn) return;

        resetToTopAndDisableRestore();

        if (!prefersReducedMotion()) btn.classList.add('is-pulsing');

        var autoRan = false;

        btn.addEventListener('pointerdown', function () {
          if (window.__fxEnabled === false) return;
          autoRan = true; // user interacted; don't auto-trigger again
          press(btn);     // burst on press-down
        });

        // On release/click: do the scroll.
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (window.__fxEnabled === false) {
            safeScrollToProjects();
            return;
          }
          safeScrollToProjects();
        });

        // Auto explosion at 3s, then scroll at 3.5s
        window.setTimeout(function () {
          if (window.__fxEnabled === false) return;
          if (!autoRan) press(btn);
        }, 3000);

        window.setTimeout(function () {
          if (window.__fxEnabled === false) return;
          safeScrollToProjects();
        }, 3500);
      });

      // Handle bfcache reloads restoring scroll position
      window.addEventListener('pageshow', function () {
        resetToTopAndDisableRestore();
      });
    })();

(function () {
      var hardwareLowPower = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 4;
      window.__autoFrameLowPower = window.__autoFrameLowPower || false;
      window.__isLowPowerMode = function () {
        return hardwareLowPower || window.__autoFrameLowPower;
      };

      function setFxEnabled(enabled) {
        window.__fxEnabled = !!enabled;
        document.body.classList.toggle('fx-off', !window.__fxEnabled);

        var btn = document.getElementById('fx-toggle');
        if (btn) {
          btn.setAttribute('aria-pressed', window.__fxEnabled ? 'true' : 'false');
          btn.textContent = window.__fxEnabled ? 'FX: On' : 'FX: Off';
        }
      }

      window.__setFxEnabled = setFxEnabled;
      window.__fxEnabled = true;

      window.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('fx-toggle');
        if (btn) {
          btn.addEventListener('click', function () {
            setFxEnabled(!(btn.getAttribute('aria-pressed') === 'true'));
          });
        }
      });
    })();

(function () {
      function initTypewriter() {
        var el = document.querySelector('.hero-greeting.typewriter');
        if (!el) return;
        var text = el.getAttribute('data-text') || el.textContent || '';
        el.textContent = '';
        var i = 0;
        var timer = window.setInterval(function () {
          if (window.__fxEnabled === false) {
            window.clearInterval(timer);
            el.textContent = text;
            el.style.borderRightColor = 'transparent';
            return;
          }
          i += 1;
          el.textContent = text.slice(0, i);
          if (i >= text.length) {
            window.clearInterval(timer);
            window.setTimeout(function () { el.style.borderRightColor = 'transparent'; }, 1200);
          }
        }, 42);
      }

      function initRotator() {
        var el = document.getElementById('hero-rotating-text');
        if (!el) return;
        var words = [
          'Cloud Virtualization',
          'Automotive Diagnostics',
          'Circuit Simulation',
          'Interactive Tooling',
          'Kernel Debugging'
        ];
        var idx = 0;
        function showWord(next) {
          el.classList.remove('in');
          el.classList.add('out');
          window.setTimeout(function () {
            if (window.__fxEnabled === false) return;
            el.textContent = words[next];
            el.classList.remove('out');
            el.classList.add('in');
          }, 180);
        }
        showWord(0);
        var rotTimer = window.setInterval(function () {
          if (window.__fxEnabled === false) {
            window.clearInterval(rotTimer);
            return;
          }
          idx = (idx + 1) % words.length;
          showWord(idx);
        }, 2200);
      }

      function initAliasReveal() {
        var alias = document.querySelector('.alias.alias-reveal');
        if (!alias) return;
        window.setTimeout(function () {
          alias.classList.add('is-visible');
        }, 420);
      }

      function initExperienceRevealAndWave() {
        var items = document.querySelectorAll('.exp-item');
        items.forEach(function (item) {
          item.classList.add('reveal-item');
          item.querySelectorAll('.exp-tech').forEach(function (chip, i) {
            chip.style.setProperty('--idx', String(i));
          });
          item.addEventListener('mouseenter', function () {
            if (window.__fxEnabled === false) return;
            item.classList.remove('exp-wave');
            void item.offsetWidth;
            item.classList.add('exp-wave');
          });
        });

        if (!('IntersectionObserver' in window)) {
          items.forEach(function (item) { item.classList.add('in-view'); });
          return;
        }

        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18 });

        items.forEach(function (item) { io.observe(item); });
      }

      function initProjectTilt() {
        var cards = document.querySelectorAll('#projects .project-card');
        cards.forEach(function (card) {
          card.addEventListener('mousemove', function (e) {
            if (window.__fxEnabled === false) return;
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width;
            var y = (e.clientY - r.top) / r.height;
            var rx = (0.5 - y) * 5.2;
            var ry = (x - 0.5) * 6.8;
            card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
            card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
          });
          card.addEventListener('mouseleave', function () {
            if (window.__fxEnabled === false) return;
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
          });
        });
      }

      function initScrollHint() {
        var hint = document.getElementById('scroll-hint');
        var projects = document.getElementById('projects');
        if (!hint || !projects) return;

        hint.addEventListener('click', function () {
          if (window.__fxEnabled === false) return;
          projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
          hint.classList.add('is-hidden');
        });

        var hiddenOnce = false;
        function onScroll() {
          if (hiddenOnce) return;
          if (window.scrollY > 90) {
            hiddenOnce = true;
            hint.classList.add('is-hidden');
            window.removeEventListener('scroll', onScroll);
          }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
      }

      function initAmbientStars() {
        var canvas = document.getElementById('ambient-stars');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var stars = [];
        var w = 0;
        var h = 0;
        function isLowPowerDevice() {
          return window.__isLowPowerMode ? window.__isLowPowerMode() : false;
        }
        var dpr = Math.min(1.5, window.devicePixelRatio || 1);
        var lastScrollY = window.scrollY || 0;
        var parX = 0;
        var parY = 0;
        var scrollProgress = 0; // 0..1
        var pointerX = 0.5;
        var pointerY = 0.5;

        // "Black hole" state (2D approximation; rendered in-canvas)
        var flashes = [];
        var nextRandomRayAt = 0;
        var initialStarCount = 0;
        var burstClusterRemaining = 0;
        var simStartAt = (performance.now ? performance.now() : Date.now());
        var consumeAllMs = 5 * 60 * 1000; // ~5 minutes until everything is consumed
        var targetFrameMs = isLowPowerDevice() ? (1000 / 30) : (1000 / 45);
        var lastFrameAt = 0;
        var framePerfQ = 1;
        var lastLowPowerState = isLowPowerDevice();
        var autoLowPowerEnteredAt = 0;
        var autoExitCooldownMs = 2500;

        function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
        function smoothstep(a, b, x) {
          var t = clamp01((x - a) / (b - a));
          return t * t * (3 - 2 * t);
        }

        function updateScrollProgress() {
          var doc = document.documentElement;
          var maxScroll = Math.max(1, (doc.scrollHeight || 0) - (window.innerHeight || 0));
          scrollProgress = clamp01((window.scrollY || 0) / maxScroll);
        }

        function updatePointer(e) {
          pointerX = clamp01((e.clientX || 0) / Math.max(1, window.innerWidth || 1));
          pointerY = clamp01((e.clientY || 0) / Math.max(1, window.innerHeight || 1));
        }

        function resize() {
          w = window.innerWidth;
          h = window.innerHeight;
          dpr = Math.min(isLowPowerDevice() ? 1.1 : 1.5, window.devicePixelRatio || 1);
          targetFrameMs = isLowPowerDevice() ? (1000 / 30) : (1000 / 45);
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          var perfMul = isLowPowerDevice() ? 0.85 : 1;
          var count = Math.max(isLowPowerDevice() ? 25 : 34, Math.floor(((w * h) / 19000) * 1.3 * perfMul * 0.7));
          initialStarCount = count;
          stars = new Array(count).fill(0).map(function () {
            // Speed distribution: current speed ~= average.
            // Most stars are slower, a few are faster (rarer).
            // We scale the buckets so the expected multiplier is ~1.
            var u = Math.random();
            var bucketMul = (u < 0.75) ? 0.7 : (u < 0.95) ? 1.0 : 2.5;
            var norm = 1 / 0.85; // makes average ~1.0
            var speedMul = bucketMul * norm;
            var baseVx = -0.05 + Math.random() * 0.1;
            var baseVy = -0.03 + Math.random() * 0.06;
            return {
              x: Math.random() * w,
              y: Math.random() * h,
              r: 0.8 + Math.random() * 1.9,
              vx: baseVx * speedMul,
              vy: baseVy * speedMul,
              a: 0.22 + Math.random() * 0.46,
              d: 0.25 + Math.random() * 0.75,
              px: 0,
              py: 0,
              heat: 0,
              hist: [],
              born: (performance.now ? performance.now() : Date.now()),
              spin: (Math.random() < 0.5 ? -1 : 1),
              seed: Math.random() * 1000
            };
          });
          for (var i = 0; i < stars.length; i++) {
            stars[i].px = stars[i].x;
            stars[i].py = stars[i].y;
            stars[i].hist = [{ x: stars[i].x, y: stars[i].y }];
          }
        }

        function pushHistory(s) {
          // Store a short motion trail in "world" space (pre-parallax).
          if (!s.hist) s.hist = [];
          var last = s.hist.length ? s.hist[s.hist.length - 1] : null;
          if (!last || Math.abs(last.x - s.x) + Math.abs(last.y - s.y) > 0.35) {
            s.hist.push({ x: s.x, y: s.y });
            if (s.hist.length > 10) s.hist.shift();
          }
        }

        function spawnFlash(points, strength, depth) {
          if (!points || points.length < 2) return;
          flashes.push({
            pts: points,
            t0: (performance.now ? performance.now() : Date.now()),
            dur: 260 + Math.random() * 240,
            s: Math.max(0.35, Math.min(1, strength || 0.65)),
            hue: (28 + Math.random() * 28), // warm -> hot
            d: (typeof depth === 'number' ? depth : 0.6),
            intensityBias: 0.75 + Math.random() * 1.35,
            // Per-burst 3D-like profile variance
            wStart: 0.45 + Math.random() * 0.35,
            wMid: 0.75 + Math.random() * 0.55,
            wEnd: 0.22 + Math.random() * 0.30,
            bStart: 0.35 + Math.random() * 0.25,
            bMid: 1.35 + Math.random() * 0.95,
            bEnd: 0.10 + Math.random() * 0.22,
            // Randomized depth profile placement (avoids fixed "bottom bright/top dim" pattern)
            depthCenter: 0.24 + Math.random() * 0.56,
            depthWidth: 0.16 + Math.random() * 0.18,
            depthGain: 0.65 + Math.random() * 0.85,
            depthInvert: (Math.random() < 0.5)
          });
          // Keep list bounded
          if (flashes.length > 14) flashes.splice(0, flashes.length - 14);
        }
        
        function scheduleNextRandomRay(now, liveRatio) {
          // High live ratio => shorter delays (more frequent rays).
          // Low live ratio => longer delays. Keep windows wide to avoid obvious patterns.
          var ratio = clamp01(liveRatio);
          var effectiveRatio = Math.min(1, ratio * 0.943);
          if (burstClusterRemaining > 0) {
            // Cluster spacing: quick but still random.
            var cmin = 95;
            var cmax = 240;
            nextRandomRayAt = now + cmin + Math.random() * (cmax - cmin);
            burstClusterRemaining -= 1;
            return;
          }

          var minDelay = 1100 + (1 - effectiveRatio) * 4600;
          var maxDelay = 3200 + (1 - effectiveRatio) * 11000;
          nextRandomRayAt = now + minDelay + Math.random() * (maxDelay - minDelay);

          // Slight clustering: occasionally schedule a short follow-up run.
          var clusterChance = Math.min(0.62, 0.22 + 0.24 * effectiveRatio);
          if (Math.random() < clusterChance) {
            burstClusterRemaining = 2 + Math.floor(Math.random() * 3); // 2..4 additional quick bursts
          }
        }

        function maybeSpawnRandomRay(bh, now) {
          var live = 0;
          var visibleLive = 0;
          var candidate = null;
          // Reservoir sampling: uniform random live particle without building arrays.
          for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            if (!s || s.dead) continue;
            live += 1;
            // Treat near-viewport particles as visible candidates.
            if (s.x > -40 && s.x < (w + 40) && s.y > -40 && s.y < (h + 40)) {
              visibleLive += 1;
            }
            if (Math.random() < (1 / live)) candidate = s;
          }
          if (live <= 0) {
            nextRandomRayAt = Number.POSITIVE_INFINITY;
            return;
          }

          // If stars are effectively gone from view, stop spawning new rays.
          if (visibleLive <= 0) {
            nextRandomRayAt = Number.POSITIVE_INFINITY;
            return;
          }

          var liveRatio = initialStarCount > 0 ? (live / initialStarCount) : 0;
          if (!nextRandomRayAt) {
            // Startup guard: avoid instant barrage when loading near page bottom.
            var startupExtra = 400 + Math.random() * 1200;
            nextRandomRayAt = now + startupExtra;
          }
          if (now < nextRandomRayAt) return;

          if (candidate && candidate.hist && candidate.hist.length >= 2) {
            var burst = gammaBurstPointsFromImpact(candidate.hist, bh);
            if (burst) {
              spawnFlash(burst, 1.0, candidate.d);
            }
          }
          scheduleNextRandomRay(now, liveRatio);
        }

        function curvePointsFromHistory(hist, bh, extraKick) {
          // Convert history into a slightly extrapolated arc (Bezier-like).
          var pts = hist.slice(0);
          if (pts.length < 2) return pts;

          var a = pts[pts.length - 2];
          var b = pts[pts.length - 1];
          var vx = b.x - a.x;
          var vy = b.y - a.y;
          var vmag = Math.max(0.001, Math.sqrt(vx * vx + vy * vy));
          vx /= vmag;
          vy /= vmag;

          // Gravity direction (toward hole) bends the tail.
          var gx = 0, gy = 0;
          if (bh && bh.s > 0.01) {
            gx = (bh.cx - b.x);
            gy = (bh.cy - b.y);
            var gmag = Math.max(0.001, Math.sqrt(gx * gx + gy * gy));
            gx /= gmag;
            gy /= gmag;
          }

          // Add a few forward points at "lightspeed" to sell the flash.
          var kick = 120 + 340 * (extraKick || 0.6);
          var bend = 0.35 + 0.65 * (extraKick || 0.6);
          for (var i = 1; i <= 5; i++) {
            var t = i / 5;
            var bx = (vx * (1 - bend) + gx * bend);
            var by = (vy * (1 - bend) + gy * bend);
            var mm = Math.max(0.001, Math.sqrt(bx * bx + by * by));
            bx /= mm;
            by /= mm;
            pts.push({
              x: b.x + bx * kick * t,
              y: b.y + by * kick * t
            });
          }
          return pts;
        }

        function gammaBurstPointsFromImpact(hist, bh) {
          // Long, bright flash that originates at the black hole.
          if (!hist || hist.length < 2 || !bh) return null;
          var impact = hist[hist.length - 1];
          var prev = hist[hist.length - 2];

          // Last motion direction
          var mvx = impact.x - prev.x;
          var mvy = impact.y - prev.y;
          var mm = Math.max(0.001, Math.sqrt(mvx * mvx + mvy * mvy));
          mvx /= mm;
          mvy /= mm;

          // Gravity direction (hole -> impact)
          var gx = impact.x - bh.cx;
          var gy = impact.y - bh.cy;
          var gm = Math.max(0.001, Math.sqrt(gx * gx + gy * gy));
          gx /= gm;
          gy /= gm;

          // Tangent around the hole for an elliptical arc feel
          var tx = -gy;
          var ty = gx;
          var sign = (Math.random() < 0.5) ? -1 : 1;

          // Exit direction (energetic; not necessarily "up")
          var dx = mvx * 0.62 + gx * 0.18 + (tx * sign) * 0.58;
          var dy = mvy * 0.62 + gy * 0.18 + (ty * sign) * 0.58;
          var dm = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
          dx /= dm;
          dy /= dm;

          // Start from a random point inside the event horizon drawing.
          // If horizon radius is not available yet, approximate from viewport scale.
          var fallbackHorizon = Math.max(6, Math.min(w, h) * 0.08);
          var horizonBase = (typeof bh.horizonR === 'number' && bh.horizonR > 0) ? bh.horizonR : fallbackHorizon;
          var eventHorizonDrawR = horizonBase * 2.2 * 0.995;
          var rr = Math.sqrt(Math.random()) * eventHorizonDrawR;
          var ra = Math.random() * Math.PI * 2;
          var p0 = {
            x: bh.cx + Math.cos(ra) * rr,
            y: bh.cy + Math.sin(ra) * rr
          };

          // Entry near lower-right viewport (wider corridor)
          var entryX = w * (0.66 + Math.random() * 0.30);
          var entryY = h * (0.78 + Math.random() * 0.18);
          var p1 = {
            x: entryX + (tx * sign) * (w * (0.07 + 0.05 * bh.s)),
            y: entryY + (ty * sign) * (h * 0.05)
          };

          // Mid-screen bend toward center-left; stronger curvature.
          var bendSign = (Math.random() < 0.5 ? -1 : 1);
          var p2 = {
            x: w * (0.28 + Math.random() * 0.30) + bendSign * (w * (0.12 + 0.10 * Math.random())),
            y: h * (0.34 + Math.random() * 0.24) - bendSign * (h * (0.16 + 0.12 * Math.random()))
          };

          // Extra shaping controls for a quintic curve (degree 5).
          var p3 = {
            x: w * (0.20 + Math.random() * 0.28),
            y: h * (0.10 + Math.random() * 0.20) - bendSign * (h * (0.10 + 0.08 * Math.random()))
          };
          var p4 = {
            x: w * (0.12 + Math.random() * 0.34) + dx * (w * 0.03),
            y: -h * (0.34 + Math.random() * 0.72)
          };
          // Endpoint: broad top-left corridor, with a slightly straighter-than-45deg tendency.
          var p5 = {
            x: w * (0.10 + Math.random() * 0.44) + dx * (w * 0.04),
            y: -h * (1.05 + Math.random() * 1.70)
          };

          var pts = [];
          var steps = 28;
          for (var i = 0; i <= steps; i++) {
            var t = i / steps;
            var it = 1 - t;
            var it2 = it * it;
            var it3 = it2 * it;
            var it4 = it3 * it;
            var it5 = it4 * it;
            var t2 = t * t;
            var t3 = t2 * t;
            var t4 = t3 * t;
            var t5 = t4 * t;
            pts.push({
              // Quintic Bezier: B(t)=sum(C(5,k)*(1-t)^(5-k)*t^k*Pk)
              x: it5 * p0.x + 5 * it4 * t * p1.x + 10 * it3 * t2 * p2.x + 10 * it2 * t3 * p3.x + 5 * it * t4 * p4.x + t5 * p5.x,
              y: it5 * p0.y + 5 * it4 * t * p1.y + 10 * it3 * t2 * p2.y + 10 * it2 * t3 * p3.y + 5 * it * t4 * p4.y + t5 * p5.y
            });
          }
          return pts;
        }

        function drawFlash(fx, now) {
          var age = now - fx.t0;
          if (age < 0) age = 0;
          var t = clamp01(age / fx.dur);
          // Bright early, fades out quickly (like a camera bloom).
          var fadeIn = smoothstep(0.0, 0.10, t);
          var fadeOut = (1 - t);
          var a = fadeIn * fadeOut * fadeOut * (1.08 - 0.08 * t);
          if (a <= 0.001) return;

          var pts = fx.pts;
          if (!pts || pts.length < 2) return;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          var coreA = Math.min(1, 0.38 + 0.75 * fx.s) * a;
          var glowA = Math.min(1, 0.20 + 0.55 * fx.s) * a;
          var w0 = 0.75 + 1.35 * fx.s;
          // Slightly dimmer for perceived depth (further in background).
          coreA *= 0.78;
          glowA *= 0.72;
          var intensityBias = (typeof fx.intensityBias === 'number') ? fx.intensityBias : 1;

          // Glow pass with along-path variation (3D depth feel).
          ctx.shadowBlur = 26 + 70 * fx.s;
          ctx.shadowColor = 'rgba(255, 255, 255,' + glowA.toFixed(3) + ')';
          var offx = parX * (fx.d || 0);
          var offy = parY * (fx.d || 0);

          // Segment render so width/brightness can vary along trajectory.
          var segCount = pts.length - 1;
          for (var i = 1; i < pts.length; i++) {
            var p0 = pts[i - 1];
            var p1 = pts[i];
            var tMid = (i - 0.5) / Math.max(1, segCount); // 0..1 along path
            var yMid = ((p0.y + p1.y) * 0.5) + offy;
            var upperFade = 1;
            if (yMid < (h * 0.5)) {
              // Fade progressively as rays move into the upper half.
              upperFade = 0.35 + 0.65 * (yMid / Math.max(1, h * 0.5));
            }

            // Bell curve around middle, with stronger contrast for depth perception.
            var bell = Math.exp(-Math.pow((tMid - 0.43) / 0.20, 2));
            // Subtler, randomized depth modulation (varies per burst orientation).
            var dp = Math.exp(-Math.pow((tMid - fx.depthCenter) / fx.depthWidth, 2));
            var depthPulse = fx.depthInvert ? (1.05 - fx.depthGain * dp * 0.45) : (0.80 + fx.depthGain * dp);
            var wMul = fx.wStart * (1 - tMid) + fx.wEnd * tMid + fx.wMid * bell;
            var edgeDark = 0.30 + 0.70 * Math.sin(Math.PI * tMid); // darker edges, hotter center
            var bMul = (fx.bStart * (1 - tMid) + fx.bEnd * tMid + fx.bMid * bell) * depthPulse * edgeDark * intensityBias * upperFade;

            // Glow segment
            // Pure white aura with a white-hot core.
            var glowAlphaSeg = Math.min(1, glowA * bMul);
            ctx.strokeStyle = 'rgba(255, 255, 255,' + glowAlphaSeg.toFixed(3) + ')';
            ctx.lineWidth = Math.max(0.0605, w0 * 0.2178 * wMul);
            ctx.beginPath();
            ctx.moveTo(p0.x + offx, p0.y + offy);
            ctx.lineTo(p1.x + offx, p1.y + offy);
            ctx.stroke();
            if (bMul > 1.05) {
              ctx.strokeStyle = 'rgba(255, 255, 255,' + Math.min(1, glowAlphaSeg * 0.35).toFixed(3) + ')';
              ctx.lineWidth = Math.max(0.0363, w0 * 0.0968 * wMul);
              ctx.beginPath();
              ctx.moveTo(p0.x + offx, p0.y + offy);
              ctx.lineTo(p1.x + offx, p1.y + offy);
              ctx.stroke();
            }
          }

          // Core pass (white-hot) with same profile variation
          ctx.shadowBlur = 0;
          for (var j = 1; j < pts.length; j++) {
            var q0 = pts[j - 1];
            var q1 = pts[j];
            var tMid2 = (j - 0.5) / Math.max(1, segCount);
            var yMid2 = ((q0.y + q1.y) * 0.5) + offy;
            var upperFade2 = 1;
            if (yMid2 < (h * 0.5)) {
              upperFade2 = 0.35 + 0.65 * (yMid2 / Math.max(1, h * 0.5));
            }
            var bell2 = Math.exp(-Math.pow((tMid2 - 0.43) / 0.20, 2));
            var dp2 = Math.exp(-Math.pow((tMid2 - fx.depthCenter) / fx.depthWidth, 2));
            var depthPulse2 = fx.depthInvert ? (1.08 - fx.depthGain * dp2 * 0.50) : (0.78 + fx.depthGain * 1.12 * dp2);
            var wMul2 = fx.wStart * (1 - tMid2) + fx.wEnd * tMid2 + fx.wMid * bell2;
            var edgeDark2 = 0.26 + 0.74 * Math.sin(Math.PI * tMid2);
            var bMul2 = (fx.bStart * (1 - tMid2) + fx.bEnd * tMid2 + fx.bMid * bell2) * depthPulse2 * edgeDark2 * (0.92 + intensityBias * 0.18) * upperFade2;
            ctx.strokeStyle = 'rgba(255, 255, 255,' + Math.min(1, coreA * bMul2).toFixed(3) + ')';
            ctx.lineWidth = Math.max(0.04235, w0 * 0.1573 * wMul2);
            ctx.beginPath();
            ctx.moveTo(q0.x + offx, q0.y + offy);
            ctx.lineTo(q1.x + offx, q1.y + offy);
            ctx.stroke();
          }

          ctx.restore();
        }

        function getBlackHole(now) {
          // Strength increases as we approach page end.
          var scrollS = reducedMotion ? smoothstep(0.72, 0.99, scrollProgress) : smoothstep(0.62, 0.98, scrollProgress);
          // Time ramp: ~5 minutes after load, everything is drawn in.
          var tS = smoothstep(0.0, 1.0, (now - simStartAt) / consumeAllMs);
          // Small floor so top-of-page still gets occasional real horizon crossings.
          var bh = Math.max(scrollS, tS, 0.18);

          // Big, cinematic — grows as we scroll down.
          var base = Math.min(w, h);
          var diskR = base * (0.48 + 0.52 * bh);
          var horizonR = diskR * (0.18 + 0.03 * bh);
          // Keep influence more localized so the whole screen doesn't "go crazy".
          var influenceR = diskR * (1.35 + 0.35 * bh);

          // Position: no mouse/pointer parallax. Keep it mostly below the viewport,
          // but guarantee the event horizon is visibly in-frame (at least a quarter).
          var cx = w * 0.62;
          // Anchor in document space so it stays near the page bottom (not viewport bottom).
          var sy = window.scrollY || 0;
          var doc = document.documentElement;
          var pageH = Math.max(h, (doc && doc.scrollHeight) ? doc.scrollHeight : h);
          var maxScroll = Math.max(0, pageH - h);

          // Desired on-screen location when user is at page bottom.
          var desiredBottomCy = h + horizonR * (0.42 + 0.22 * bh);
          var minBottomCy = h + horizonR * 0.22;
          var maxBottomCy = h + horizonR * 0.70;
          var bottomCy = Math.min(maxBottomCy, Math.max(minBottomCy, desiredBottomCy));

          // Convert bottom-anchored world position to current viewport position.
          var worldCy = maxScroll + bottomCy;
          var cy = worldCy - sy;

          // No mouse parallax: lock the disk tilt.
          var tilt = 0;
          var squish = 0.32 + (0.62 * (1 - Math.abs(tilt))); // ellipse ratio
          // Rotation: locked (no spin).
          var rot = 0;

          return {
            s: bh,
            ts: tS,
            cx: cx,
            cy: cy,
            diskR: diskR,
            horizonR: horizonR,
            influenceR: influenceR,
            squish: squish,
            rot: rot
          };
        }

        function drawAccretionDisk(bh, now, perfQ) {
          if (bh.s <= 0.001) return;

          var s = bh.s;
          var lp = isLowPowerDevice();
          var q = Math.max(0.62, Math.min(1, typeof perfQ === 'number' ? perfQ : 1));
          var eventHorizonR = bh.horizonR * 2.2;
          var tilt = (-Math.PI / 4) + bh.rot; // right side up 45deg
          var diskA = eventHorizonR * 1.30;
          var diskB = eventHorizonR * 0.19;
          var drawFringe = !lp && q > 0.82 && s > 0.12;
          var drawLegacyBackGlow = !lp && q > 0.72 && s > 0.08;
          var drawOuterHorizonHalo = !lp && q > 0.80 && s > 0.10;

          function drawDiskHalf(isForeground) {
            var startAngle = isForeground ? Math.PI : 0;
            var endAngle = isForeground ? Math.PI * 2 : Math.PI;
            var depthMul = isForeground ? 1 : 0.82;

            // Outer red-orange plasma layer.
            ctx.beginPath();
            ctx.ellipse(0, 0, diskA, diskB, tilt, startAngle, endAngle);
            ctx.lineCap = 'round';
            ctx.globalCompositeOperation = isForeground ? 'source-over' : 'screen';
            ctx.globalAlpha = isForeground ? Math.min(1, 0.92 + 0.08 * s) : Math.min(1, 0.72 + 0.22 * s);
            ctx.strokeStyle = isForeground ? 'rgba(255, 142, 74, 0.98)' : 'rgba(244, 118, 72, 0.94)';
            ctx.lineWidth = Math.max(lp ? 4.0 : 6.0, eventHorizonR * (lp ? 0.18 : 0.26));
            ctx.shadowBlur = ((isForeground ? (180 + 420 * s) : (240 + 560 * s)) * depthMul) * q * (lp ? 0.45 : 1);
            ctx.shadowColor = isForeground ? 'rgba(255, 62, 12, 1)' : 'rgba(226, 58, 18, 0.98)';
            ctx.stroke();

            // Mid orange band adds depth between core and halo.
            ctx.beginPath();
            ctx.ellipse(0, 0, diskA * 0.992, diskB * 0.92, tilt, startAngle, endAngle);
            ctx.globalAlpha = isForeground ? Math.min(1, 0.82 + 0.14 * s) : Math.min(1, 0.62 + 0.22 * s);
            ctx.strokeStyle = isForeground ? 'rgba(255, 106, 42, 0.96)' : 'rgba(230, 86, 46, 0.92)';
            ctx.lineWidth = Math.max(lp ? 2.6 : 5.0, eventHorizonR * (lp ? 0.10 : 0.20));
            ctx.shadowBlur = ((isForeground ? (120 + 300 * s) : (170 + 420 * s)) * depthMul) * q * (lp ? 0.40 : 1);
            ctx.shadowColor = isForeground ? 'rgba(255, 76, 18, 0.98)' : 'rgba(160, 56, 136, 0.90)';
            ctx.stroke();

            // White-hot core line for both halves so colors/layering match.
            ctx.beginPath();
            ctx.ellipse(0, 0, diskA * 0.985, diskB * 0.88, tilt, startAngle, endAngle);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgba(255, 255, 246, 1)';
            ctx.lineWidth = Math.max(lp ? 2.0 : 3.8, eventHorizonR * (lp ? 0.09 : 0.18));
            ctx.shadowBlur = ((isForeground ? (180 + 420 * s) : (220 + 520 * s)) * depthMul) * q * (lp ? 0.35 : 1);
            ctx.shadowColor = 'rgba(255, 200, 120, 1)';
            ctx.stroke();

            // Exotic ionized fringe: subtle magenta/purple chroma.
            if (drawFringe) {
              ctx.beginPath();
              ctx.ellipse(0, 0, diskA * 1.01, diskB * 0.98, tilt, startAngle, endAngle);
              ctx.globalAlpha = isForeground ? 0 : Math.min(1, 0.30 + 0.12 * s);
              ctx.strokeStyle = isForeground ? 'rgba(0, 0, 0, 0)' : 'rgba(188, 98, 246, 0.62)';
              ctx.lineWidth = Math.max(2.2, eventHorizonR * 0.10);
              ctx.shadowBlur = isForeground ? 0 : ((130 + 280 * s) * depthMul) * q;
              ctx.shadowColor = isForeground ? 'rgba(0, 0, 0, 0)' : 'rgba(168, 72, 232, 0.92)';
              ctx.stroke();
            }

            // Needle-thin scorching center to boost perceived temperature.
            ctx.beginPath();
            ctx.ellipse(0, 0, diskA * 0.978, diskB * 0.82, tilt, startAngle, endAngle);
            ctx.globalAlpha = Math.min(1, 0.92 + 0.08 * s);
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
            ctx.lineWidth = Math.max(lp ? 1.0 : 1.8, eventHorizonR * (lp ? 0.05 : 0.08));
            ctx.shadowBlur = ((isForeground ? (140 + 340 * s) : (170 + 420 * s)) * depthMul) * q * (lp ? 0.30 : 1);
            ctx.shadowColor = 'rgba(255, 225, 170, 1)';
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          ctx.save();
          ctx.translate(bh.cx, bh.cy);
          // Tight clip around BH rendering region to reduce overdraw.
          var clipPad = eventHorizonR * 2.8;
          ctx.beginPath();
          ctx.rect(-clipPad, -clipPad, clipPad * 2, clipPad * 2);
          ctx.clip();

          // Legacy full background ellipse pass (from previous implementation).
          if (drawLegacyBackGlow) {
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = Math.min(1, 0.62 + 0.28 * s);
            ctx.shadowBlur = (260 + 700 * s) * q;
            ctx.shadowColor = 'rgba(255, 70, 18, 1)';
            ctx.strokeStyle = 'rgba(255, 180, 95, 0.96)';
            ctx.lineWidth = Math.max(3.8, eventHorizonR * 0.18);
            ctx.beginPath();
            ctx.ellipse(0, 0, diskA * 1.02, diskB * 1.08, tilt, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          // 1) Back half arch
          drawDiskHalf(false);

          // 2) Event horizon (abrupt black circle)
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(0,0,0,1)';
          ctx.beginPath();
          ctx.arc(0, 0, eventHorizonR * 0.995, 0, Math.PI * 2);
          ctx.fill();

          // Event-horizon outline ring: layered, white-hot core with rich outward falloff.
          ctx.globalCompositeOperation = 'screen';

          // Core white-hot edge.
          ctx.globalAlpha = Math.min(1, 0.92 + 0.08 * s);
          ctx.shadowBlur = (150 + 360 * s) * q * (lp ? 0.42 : 1);
          ctx.shadowColor = 'rgba(255, 170, 86, 1)';
          ctx.strokeStyle = 'rgba(255, 255, 250, 1)';
          ctx.lineWidth = Math.max(lp ? 2.0 : 3.4, eventHorizonR * (lp ? 0.09 : 0.16));
          ctx.beginPath();
          ctx.arc(0, 0, eventHorizonR * 1.004, 0, Math.PI * 2);
          ctx.stroke();

          // Mid orange/red plasma band.
          ctx.globalAlpha = Math.min(1, 0.78 + 0.16 * s);
          ctx.shadowBlur = (230 + 560 * s) * q * (lp ? 0.36 : 1);
          ctx.shadowColor = 'rgba(255, 82, 22, 1)';
          ctx.strokeStyle = 'rgba(255, 122, 42, 0.98)';
          ctx.lineWidth = Math.max(lp ? 2.8 : 5.0, eventHorizonR * (lp ? 0.12 : 0.24));
          ctx.beginPath();
          ctx.arc(0, 0, eventHorizonR * 1.018, 0, Math.PI * 2);
          ctx.stroke();

          if (drawOuterHorizonHalo) {
            // Outer deep-red halo: layered alpha strokes (cheaper than one huge blur pass).
            ctx.globalAlpha = Math.min(1, 0.42 + 0.16 * s);
            ctx.shadowBlur = (120 + 260 * s) * q;
            ctx.shadowColor = 'rgba(255, 56, 16, 0.96)';
            ctx.strokeStyle = 'rgba(220, 68, 34, 0.72)';
            ctx.lineWidth = Math.max(4.6, eventHorizonR * 0.22);
            ctx.beginPath();
            ctx.arc(0, 0, eventHorizonR * 1.036, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = Math.min(1, 0.28 + 0.12 * s);
            ctx.shadowBlur = (170 + 320 * s) * q;
            ctx.shadowColor = 'rgba(255, 40, 10, 0.88)';
            ctx.strokeStyle = 'rgba(200, 56, 30, 0.56)';
            ctx.lineWidth = Math.max(3.2, eventHorizonR * 0.16);
            ctx.beginPath();
            ctx.arc(0, 0, eventHorizonR * 1.048, 0, Math.PI * 2);
            ctx.stroke();

            // Subtle exotic chroma fringe at the far edge.
            if (drawFringe) {
              ctx.globalAlpha = Math.min(1, 0.24 + 0.10 * s);
              ctx.shadowBlur = (280 + 720 * s) * q;
              ctx.shadowColor = 'rgba(166, 72, 230, 0.92)';
              ctx.strokeStyle = 'rgba(196, 112, 250, 0.58)';
              ctx.lineWidth = Math.max(2.2, eventHorizonR * 0.10);
              ctx.beginPath();
              ctx.arc(0, 0, eventHorizonR * 1.052, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
          ctx.shadowBlur = 0;

          // 3) Front half track
          drawDiskHalf(true);

          // Final top coat: force the foreground lip above all other disk bands.
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.lineCap = 'round';
          ctx.shadowBlur = lp ? (24 + 70 * s) : (60 + 180 * s);
          ctx.shadowColor = 'rgba(255, 210, 150, 0.92)';
          ctx.strokeStyle = 'rgba(255, 255, 252, 0.98)';
          ctx.lineWidth = Math.max(lp ? 1.6 : 2.6, eventHorizonR * (lp ? 0.07 : 0.11));
          ctx.beginPath();
          ctx.ellipse(0, 0, diskA * 0.985, diskB * 0.88, tilt, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.restore();
          ctx.globalAlpha = 1;
        }

        function drawForegroundDiskTop(bh) {
          var lp = isLowPowerDevice();
          var s = bh.s;
          var eventHorizonR = bh.horizonR * 2.2;
          var tilt = (-Math.PI / 4) + bh.rot;
          var diskA = eventHorizonR * 1.30;
          var diskB = eventHorizonR * 0.19;
          var startAngle = Math.PI;
          var endAngle = Math.PI * 2;

          ctx.save();
          ctx.translate(bh.cx, bh.cy);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.lineCap = 'round';

          // Re-draw full foreground stack as the top-most layer.
          ctx.beginPath();
          ctx.ellipse(0, 0, diskA, diskB, tilt, startAngle, endAngle);
          ctx.strokeStyle = 'rgba(255, 142, 74, 0.98)';
          ctx.lineWidth = Math.max(lp ? 4.0 : 6.0, eventHorizonR * (lp ? 0.18 : 0.26));
          ctx.shadowBlur = lp ? (40 + 90 * s) : (90 + 220 * s);
          ctx.shadowColor = 'rgba(255, 62, 12, 0.95)';
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, diskA * 0.992, diskB * 0.92, tilt, startAngle, endAngle);
          ctx.strokeStyle = 'rgba(255, 106, 42, 0.96)';
          ctx.lineWidth = Math.max(lp ? 2.6 : 5.0, eventHorizonR * (lp ? 0.10 : 0.20));
          ctx.shadowBlur = lp ? (26 + 70 * s) : (70 + 170 * s);
          ctx.shadowColor = 'rgba(255, 76, 18, 0.94)';
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, diskA * 0.985, diskB * 0.88, tilt, startAngle, endAngle);
          ctx.strokeStyle = 'rgba(255, 255, 246, 1)';
          ctx.lineWidth = Math.max(lp ? 2.0 : 3.8, eventHorizonR * (lp ? 0.09 : 0.18));
          ctx.shadowBlur = lp ? (22 + 56 * s) : (60 + 150 * s);
          ctx.shadowColor = 'rgba(255, 200, 120, 0.95)';
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.restore();
        }

        function respawnStar(s, bh, now) {
          // Respawn away from the hole so "consumed" feels final.
          var pad = 30;
          var side = Math.floor(Math.random() * 4);
          if (side === 0) { s.x = -pad; s.y = Math.random() * h; }
          else if (side === 1) { s.x = w + pad; s.y = Math.random() * h; }
          else if (side === 2) { s.x = Math.random() * w; s.y = -pad; }
          else { s.x = Math.random() * w; s.y = h + pad; }
          s.px = s.x;
          s.py = s.y;
          s.beam = 0;
          s.heat = 0;
          s.hist = [{ x: s.x, y: s.y }];
          s.born = (typeof now === 'number' ? now : (performance.now ? performance.now() : Date.now()));
          // Slightly steer towards the center area (keeps distribution nice)
          var dx = (w * 0.5) - s.x;
          var dy = (h * 0.45) - s.y;
          var m = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          var base = 0.06 + Math.random() * 0.08;
          s.vx = (dx / m) * base + (-0.04 + Math.random() * 0.08);
          s.vy = (dy / m) * base + (-0.03 + Math.random() * 0.06);
          // Ensure it's not immediately inside influence on respawn
          if (bh && bh.s > 0.1) {
            var ddx = s.x - bh.cx;
            var ddy = s.y - bh.cy;
            if ((ddx * ddx + ddy * ddy) < (bh.influenceR * bh.influenceR)) {
              s.x += (ddx < 0 ? -1 : 1) * bh.influenceR;
              s.y += (ddy < 0 ? -1 : 1) * bh.influenceR;
            }
          }
        }

        function tick(now) {
          if (document.hidden) {
            window.setTimeout(function () { window.requestAnimationFrame(tick); }, 250);
            return;
          }

          if (lastFrameAt && (now - lastFrameAt) < targetFrameMs) {
            window.requestAnimationFrame(tick);
            return;
          }
          var frameBudgetMs = lastFrameAt ? Math.max(0, now - lastFrameAt) : targetFrameMs;
          lastFrameAt = now;

          var shouldUseLowPowerNow = frameBudgetMs > 22.22; // below ~45 FPS
          if (!window.__autoFrameLowPower && shouldUseLowPowerNow) {
            window.__autoFrameLowPower = true;
            autoLowPowerEnteredAt = now;
          } else if (window.__autoFrameLowPower && !shouldUseLowPowerNow) {
            if ((now - autoLowPowerEnteredAt) >= autoExitCooldownMs) {
              window.__autoFrameLowPower = false;
              autoLowPowerEnteredAt = 0;
            }
          }

          var currentLowPowerState = isLowPowerDevice();
          if (currentLowPowerState !== lastLowPowerState) {
            lastLowPowerState = currentLowPowerState;
            resize();
            frameBudgetMs = targetFrameMs;
            lastFrameAt = now;
          }

          if (window.__fxEnabled === false) {
            window.requestAnimationFrame(tick);
            return;
          }
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'lighter';

          // Scroll-reactive parallax drift (subtle)
          if (!reducedMotion) {
            var sy = window.scrollY || 0;
            var dy = sy - lastScrollY;
            lastScrollY = sy;
            parY += dy * 0.08;
            parX += dy * 0.02;
            parX *= 0.92;
            parY *= 0.92;
          } else {
            parX = 0;
            parY = 0;
          }

          updateScrollProgress();
          var bh = getBlackHole(now);
          var slow = frameBudgetMs > 22 ? 1 : 0;
          var perfQ = slow ? 0.74 : 1;
          framePerfQ = perfQ;

          // Background fade-to-black near the end (in-canvas, behind everything).
          var fade = smoothstep(0.70, 1.0, scrollProgress);
          // Also drive CSS fade so nebula layer dims/desaturates cinematically.
          try {
            document.body.style.setProperty('--end-fade', String(fade));
          } catch (e) {}
          if (fade > 0.001) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            // A deeper "space swallow" as we approach the end.
            ctx.fillStyle = 'rgba(0,0,0,' + (0.32 * fade).toFixed(3) + ')';
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
            ctx.globalCompositeOperation = 'lighter';
          }

          if (!reducedMotion) maybeSpawnRandomRay(bh, now);

          var starDrawStride = (isLowPowerDevice() || perfQ < 0.82) ? 2 : 1;
          for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            if (s.dead) continue;
            s.px = s.x;
            s.py = s.y;
            pushHistory(s);

            // Subtle "space flow" (keeps trajectories diverse and curved across the screen).
            // Very small so it doesn't fight the black hole; adds variety to lanes.
            if (!reducedMotion) {
              var cx0 = w * 0.5;
              var cy0 = h * 0.45;
              var fx = s.x - cx0;
              var fy = s.y - cy0;
              var curl = (0.0000022 + 0.000006 * (bh.ts || 0)) * (0.6 + 0.4 * s.d);
              // Rotational field around center:
              s.vx += (-fy) * curl;
              s.vy += (fx) * curl;
              // Tiny wandering to prevent banding:
              var n = Math.sin((now * 0.00055) + s.seed) * Math.cos((now * 0.00038) + s.seed * 0.7);
              s.vx += n * 0.0006;
              s.vy += Math.cos((now * 0.00047) + s.seed * 1.3) * 0.00055;
            }

            // Black-hole interaction: lensing + swirl + event horizon.
            if (bh.s > 0.01) {
              var dxh = s.x - bh.cx;
              var dyh = s.y - bh.cy;
              var d2 = dxh * dxh + dyh * dyh;
              var d = Math.sqrt(d2) || 1;

              // Consume if it crosses the event horizon.
              // Near top-of-page and when the hole is below viewport, widen capture trigger
              // so authentic bursts still happen from consumed particles.
              var topBoost = (1 - scrollProgress) * (0.22 + 0.20 * (1 - bh.ts));
              var offscreenBelow = clamp01((bh.cy - h) / Math.max(1, bh.horizonR * 2.6));
              var captureRadius = bh.horizonR * ((1.14 + topBoost + offscreenBelow * 1.05) + 0.08 * Math.sin((now * 0.001) + i));
              // Funnel capture: if BH is off-screen, nearby inward-moving particles are
              // considered captured before crossing the tiny visible horizon.
              var vr = ((s.vx * dxh) + (s.vy * dyh)) / d; // radial velocity (>0 = moving away)
              var funnelCapture = offscreenBelow > 0.05 && d < (bh.horizonR * (2.8 + offscreenBelow * 3.2)) && vr < -0.012;
              if (d < captureRadius || funnelCapture) {
                // Scheduler controls burst timing to prevent visual "ray dumps".
                // Near-horizon particles are strongly damped so they linger/circle
                // until selected by the random ray scheduler.
                s.vx *= 0.88;
                s.vy *= 0.88;
              }

              // Always-on gravity: a slight pull everywhere, ramps up with time so all get consumed.
              var ndxAll = dxh / d;
              var ndyAll = dyh / d;
              var minWH = Math.min(w, h) || 1;
              var fall = 1 / (1 + Math.pow(d / (minWH * 0.85), 2));
              // Extra early/top boost so first screen still produces authentic bursts.
              var earlyTopBoost = (1 - scrollProgress) * (1 - bh.ts) * 0.55;
              var basePull = 2 * (0.0017 + 0.0056 * bh.ts) * (0.90 + 0.88 * bh.s) * (1 + earlyTopBoost);
              s.vx -= ndxAll * basePull * fall;
              s.vy -= ndyAll * basePull * fall;

              // Add angular momentum everywhere so paths curve more and distribute better.
              // Each particle has its own spin direction, so arcs spread out across the screen.
              if (!reducedMotion) {
                var txAll = -ndyAll * s.spin;
                var tyAll = ndxAll * s.spin;
                var swirlAll = (0.00055 + 0.0026 * bh.ts) * (0.35 + 0.65 * fall) * (0.75 + 0.35 * s.d);
                s.vx += txAll * swirlAll;
                s.vy += tyAll * swirlAll;
              }

              // Influence zone
              if (d < bh.influenceR) {
                var ndx = dxh / d;
                var ndy = dyh / d;
                var proximity = 1 - clamp01(d / bh.influenceR); // 0 far -> 1 near
                var pull = 2 * (0.023 + 0.040 * bh.s) * proximity * proximity;
                // Radial pull
                s.vx -= ndx * pull;
                s.vy -= ndy * pull;
                // Tangential swirl (gives accretion-like motion)
                var swirl = (0.017 + 0.030 * bh.s) * proximity;
                s.vx += -ndy * swirl;
                s.vy += ndx * swirl;
                // Heat/brightness boost near disk
                s.heat = Math.min(1, s.heat * 0.90 + proximity * (0.18 + 0.30 * bh.s));

                // Safety clamp: keep motion dramatic but stable.
                var v2 = s.vx * s.vx + s.vy * s.vy;
                var vmax = 0.22 + 0.55 * bh.s + 0.45 * proximity; // caps in px/frame units
                var vmax2 = vmax * vmax;
                if (v2 > vmax2) {
                  var inv = vmax / Math.sqrt(v2);
                  s.vx *= inv;
                  s.vy *= inv;
                }
              } else {
                s.heat *= 0.92;
              }
            } else {
              s.heat *= 0.92;
            }

            s.x += s.vx;
            s.y += s.vy;

            var tw = reducedMotion ? 1 : (0.65 + 0.35 * Math.sin((now * 0.001) + (s.x * 0.004) + (s.y * 0.003)));
            var outerAlpha = Math.min(1, s.a * 1.05 * tw);
            var coreAlpha = Math.min(1, s.a * 1.35 * tw);

            var px = s.x + parX * s.d;
            var py = s.y + parY * s.d;

            // Gravitational lensing (visual-only): warp drawn position around the hole.
            // This is a stylized 2D approximation: stronger near the Einstein ring,
            // with a tangential bend plus slight radial magnification.
            if (!reducedMotion && bh.s > 0.02) {
              var ldx = px - bh.cx;
              var ldy = py - bh.cy;
              var ld2 = ldx * ldx + ldy * ldy;
              var ld = Math.sqrt(ld2) || 1;
              var ringR = bh.horizonR * (1.95 + 0.25 * bh.s);
              var ringW = Math.max(18, bh.horizonR * 0.55);
              var ringT = Math.exp(-Math.pow((ld - ringR) / ringW, 2)); // 0..1
              var inT = 1 - clamp01(ld / (bh.influenceR * 1.05));

              var ndx = ldx / ld;
              var ndy = ldy / ld;
              var tx = -ndy;
              var ty = ndx;

              // Bend intensity peaks at ring, with a bit of broader influence.
              var bend = (10 + 32 * bh.s) * (0.12 * inT + 0.88 * ringT) * (0.35 + 0.65 * s.d);
              // Direction flips above/below "disk plane" to sell 3D-ish lensing.
              var flip = (py < bh.cy) ? -1 : 1;
              px += tx * bend * flip;
              py += ty * bend * flip;

              // Slight outward magnification near ring
              var magn = (6 + 14 * bh.s) * ringT;
              px += ndx * magn;
              py += ndy * magn;
            }

            var heat = s.heat || 0;
            var born = (typeof s.born === 'number' ? s.born : now);
            var spawnFade = clamp01((now - born) / 520);
            var haloR = s.r * (2.1 + 0.85 * heat);
            var haloA = outerAlpha * (1 + 0.65 * heat) * spawnFade;
            var coreA2 = coreAlpha * (1 + 0.75 * heat) * spawnFade;
            var warm = 'rgba(255, 175, 90,' + Math.min(1, haloA).toFixed(3) + ')';

            // Soft glow halo (expensive): draw fewer and cheaper on weak frames/devices.
            if ((i % starDrawStride) === 0) {
              var haloBlur = (isLowPowerDevice() || perfQ < 0.82) ? (6 + s.r * 6 + 8 * heat) : (14 + s.r * 12 + 16 * heat);
              ctx.shadowBlur = haloBlur;
              ctx.shadowColor = warm;
              ctx.beginPath();
              ctx.fillStyle = warm;
              ctx.arc(px, py, haloR, 0, Math.PI * 2);
              ctx.fill();
            }

            // Bright core point
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 245, 225,' + Math.min(1, coreA2).toFixed(3) + ')';
            ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalCompositeOperation = 'source-over';

          // Draw flashes last so they carve over everything.
          if (flashes.length) {
            for (var fi = flashes.length - 1; fi >= 0; fi--) {
              var fx = flashes[fi];
              var age = now - fx.t0;
              if (age > fx.dur + 40) {
                flashes.splice(fi, 1);
                continue;
              }
              drawFlash(fx, now);
            }
          }

          var bhVisible = (bh.cy + bh.diskR) > -120 && (bh.cy - bh.diskR) < (h + 180);

          // Draw black hole only when near viewport to reduce expensive blur passes.
          if (bhVisible) {
            drawAccretionDisk(bh, now, perfQ);
          }

          // Einstein ring highlight (only when BH is near viewport)
          if (!reducedMotion && bhVisible && bh.s > 0.06) {
            var lpRing = isLowPowerDevice();
            ctx.save();
            ctx.translate(bh.cx, bh.cy);
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = Math.min(1, 0.34 + 0.56 * bh.s);
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
            ctx.lineWidth = Math.max(lpRing ? 1.6 : 2.8, bh.horizonR * (lpRing ? 0.09 : 0.16));
            ctx.beginPath();
            ctx.arc(0, 0, bh.horizonR * (1.95 + 0.25 * bh.s), 0, Math.PI * 2);
            ctx.stroke();

            if (!lpRing) {
              // Soft glow around ring
              ctx.globalAlpha = Math.min(1, 0.26 + 0.44 * bh.s);
              ctx.shadowBlur = 100 + 240 * bh.s;
              ctx.shadowColor = 'rgba(255, 52, 6, 1)';
              ctx.lineWidth = Math.max(2.2, bh.horizonR * 0.12);
              ctx.strokeStyle = 'rgba(255, 96, 24, 0.98)';
              ctx.beginPath();
              ctx.arc(0, 0, bh.horizonR * (1.95 + 0.25 * bh.s), 0, Math.PI * 2);
              ctx.stroke();

              // Nuclear-hot outer accent for maximum warm contrast.
              ctx.globalAlpha = Math.min(1, 0.22 + 0.38 * bh.s);
              ctx.shadowBlur = 160 + 420 * bh.s;
              ctx.shadowColor = 'rgba(255, 24, 0, 1)';
              ctx.lineWidth = Math.max(2.8, bh.horizonR * 0.14);
              ctx.strokeStyle = 'rgba(255, 70, 10, 0.98)';
              ctx.beginPath();
              ctx.arc(0, 0, bh.horizonR * (2.02 + 0.28 * bh.s), 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.restore();
          }

          // Absolute final foreground pass so the front disk never sits under perimeter rings.
          if (bhVisible) {
            drawForegroundDiskTop(bh);
          }

          window.requestAnimationFrame(tick);
        }

        resize();
        window.addEventListener('resize', resize);
        updateScrollProgress();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        // Pointer parallax disabled for the black hole.
        window.requestAnimationFrame(tick);
      }

      window.addEventListener('DOMContentLoaded', function () {
        initTypewriter();
        initRotator();
        initAliasReveal();
        initExperienceRevealAndWave();
        initProjectTilt();
        initScrollHint();
        initAmbientStars();
      });
    })();
