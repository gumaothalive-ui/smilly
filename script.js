/* STARS */
const cvs = document.getElementById('stars-canvas');
const ctx = cvs.getContext('2d');
let w, h;
function rz() {
  w = cvs.width = window.innerWidth;
  h = cvs.height = window.innerHeight;
}
window.addEventListener('resize', rz);
rz();
const stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.5,
    a: Math.random(),
    va: (Math.random() - 0.5) * 0.05
  });
}
function drawStars() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach(s => {
    s.a += s.va;
    if (s.a > 1) { s.a = 1; s.va *= -1; }
    else if (s.a < 0.1) { s.a = 0.1; s.va *= -1; }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 248, 249, ${s.a * 0.7})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* PETALS */
const pc = document.getElementById('petals');
const pcols = ['#f8c8d4', '#d63b58', '#ffccd5', '#e0a062'];
for (let i = 0; i < 25; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  const sz = 8 + Math.random() * 12;
  p.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${pcols[Math.floor(Math.random()*pcols.length)]};animation-duration:${8+Math.random()*10}s;animation-delay:${Math.random()*15}s;opacity:${0.4+Math.random()*0.4};`;
  pc.appendChild(p);
}

/* YOUTUBE */
let yt = null, isP = false;
function onYouTubeIframeAPIReady() {
  yt = new YT.Player('yt-player', {
    height: '1', width: '1', videoId: 'pB-5XG-DbAA',
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: 'pB-5XG-DbAA', rel: 0, modestbranding: 1, start: 32 },
    events: { onReady: e => e.target.setVolume(45) }
  });
}
const pbtn = document.getElementById('pbtn');
const eq = document.getElementById('eq');
pbtn.addEventListener('click', () => {
  if (!yt || typeof yt.playVideo !== 'function') return;
  if (isP) { yt.pauseVideo(); isP = false; pbtn.innerHTML = '▶'; eq.classList.add('p'); }
  else { yt.playVideo(); isP = true; pbtn.innerHTML = '⏸'; eq.classList.remove('p'); }
});

/* TTS */
const ttsBtn = document.getElementById('tts-btn');
const wave = document.getElementById('wave');
const msgText = document.getElementById('read-text').innerText;
const msgHtml = document.getElementById('read-text').innerHTML;
let synth = window.speechSynthesis;
let ut = null;

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');

function playTTS() {
  if (synth.speaking) synth.cancel();
  ut = new SpeechSynthesisUtterance(msgText);
  ut.lang = 'en-US'; ut.rate = 0.9; ut.pitch = 1; ut.volume = 1;
  const voices = synth.getVoices();
  let v = voices.find(v => (v.lang.includes('en') || v.name.includes('English')) && v.name.includes('Natural')) ||
          voices.find(v => (v.lang.includes('en') || v.name.includes('English')) && (v.name.includes('Aria') || v.name.includes('Jenny'))) ||
          voices.find(v => v.name.includes('Google US English')) ||
          voices.find(v => v.name.includes('Google UK English')) ||
          voices.find(v => v.name.includes('English')) ||
          voices.find(v => v.lang.startsWith('en'));
  if (!v && voices.length > 0) v = voices.find(v => !v.lang.toLowerCase().includes('af')) || voices[0];
  if (v) { ut.voice = v; ut.lang = v.lang || 'en-US'; }
  
  const textEl = document.getElementById('read-text');
  textEl.innerHTML = ''; // Clear for typewriter effect

  ut.onboundary = (e) => {
    let spokenText = msgText.substring(0, e.charIndex + e.charLength);
    textEl.innerHTML = spokenText.replace(/\n/g, '<br>');
  };

  ut.onend = () => {
    textEl.innerHTML = msgHtml; // Restore full html formatting
    ttsBtn.classList.remove('on'); wave.classList.remove('on');
    ttsBtn.innerHTML = '<span class="tts-ic">🎙️</span> Listen to my heart';
    
    // Cinematic Photo Sequence over the site
    const cineOverlay = document.getElementById('cinematic-overlay');
    cineOverlay.innerHTML = '<img id="cine1" class="cine-ph"><img id="cine2" class="cine-ph"><div id="cine-x">✕</div>';
    
    const cine1 = document.getElementById('cine1');
    const cine2 = document.getElementById('cine2');
    const images = ['WhatsApp Image 2026-02-21 at 10.35.22 PM.jpeg', 'WhatsApp Image 2026-02-21 at 10.35.38 PM.jpeg'];
    
    document.getElementById('cine-x').onclick = () => {
      cineOverlay.classList.remove('on');
      clearTimeout(window.cineTimeout);
    };

    setTimeout(() => {
      cineOverlay.classList.add('on');
      
      let activeIndex = 0;
      function playLoop() {
        let currentImg = (activeIndex % 2 === 0) ? cine1 : cine2;
        let prevImg = (activeIndex % 2 === 0) ? cine2 : cine1;
        
        currentImg.src = images[activeIndex % images.length];
        currentImg.style.zIndex = 2;
        
        // Remove pop class to reset animation, trigger reflow, add back
        currentImg.classList.remove('pop');
        void currentImg.offsetWidth;
        currentImg.classList.add('pop');
        
        // Keep previous image visible underneath during transition
        prevImg.style.zIndex = 1;
        
        activeIndex++;
        window.cineTimeout = setTimeout(playLoop, 3500); // 3.5s per image
      }
      
      setTimeout(playLoop, 400); // slight delay after dark background appears
    }, 500);
  };
  
  synth.speak(ut);
  ttsBtn.classList.add('on'); wave.classList.add('on');
  ttsBtn.innerHTML = '<span class="tts-ic">⏹️</span> Stop listening';
}

startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  const startBg = document.getElementById('start-bg-video');
  if(startBg) startBg.pause();
  
  document.getElementById('bg-video').classList.add('vis');
  document.querySelector('.hero-vig').classList.add('vis');
  
  if (yt && typeof yt.playVideo === 'function') {
    yt.playVideo(); isP = true; pbtn.innerHTML = '⏸'; eq.classList.remove('p');
  }
  
  // Cinematic Timeline: Wait 3.5s on Hero, scroll to Message, then read
  setTimeout(() => {
    document.getElementById('msg-sec').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      playTTS();
    }, 1000); // Wait for the smooth scroll to finish
  }, 3500);
});

ttsBtn.addEventListener('click', () => {
  if (synth.speaking) {
    synth.cancel(); ttsBtn.classList.remove('on'); wave.classList.remove('on');
    ttsBtn.innerHTML = '<span class="tts-ic">🎙️</span> Listen to my heart';
  } else {
    playTTS();
  }
});
// Ensure voices are loaded
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => synth.getVoices();
}

/* REVEAL */
const rev = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(e => {
  e.forEach((en, i) => {
    if (en.isIntersecting) setTimeout(() => en.target.classList.add('vis'), i * 150);
  });
}, { threshold: 0.15 });
rev.forEach(el => obs.observe(el));

/* LIGHTBOX */
const lb = document.getElementById('lb'), lbi = document.getElementById('lb-img');
window.openLb = (el) => { lbi.src = el.querySelector('img').src; lb.classList.add('on'); document.body.style.overflow = 'hidden'; }
window.closeLb = () => { lb.classList.remove('on'); document.body.style.overflow = ''; }
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

const bgv = document.getElementById('bg-video');
bgv.muted = true; bgv.play().catch(()=>{});
