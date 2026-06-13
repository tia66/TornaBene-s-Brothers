
/* ─── NAVBAR ─── */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>60)
},{ passive:true });

/* ─── MOBILE MENU ─── */
function toggleMobile(){
  const m=document.getElementById('mobile-menu');
  const h=document.getElementById('hamburger');
  const open=m.classList.toggle('open');
  document.body.style.overflow=open?'hidden':'';
  h.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');
}
function closeMobile(){
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow='';
  document.getElementById('hamburger').setAttribute('aria-label','Apri menu');
}

/* ─── SCROLL REVEAL ─── */
const revealObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}
  })
},{threshold:.12,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revealObs.observe(el));

/* ─── MASONRY PORTFOLIO ─── */
const portfolioItems = [
  { cat: 'evento', img: 'assets/pics/foto1.jpg', couple: 'nome', loc: 'luogo' },
  { cat: 'evento', img: 'assets/pics/foto2.jpg', couple: 'nome', loc: 'luogo' },
  { cat: 'evento', img: 'assets/pics/foto3.jpg', couple: 'nome', loc: 'luogo' },
  { cat: 'evento', img: 'assets/pics/foto4.jpg', couple: 'nome', loc: 'luogo' },
  { cat: 'evento', img: 'assets/pics/foto5.jpg', couple: 'nome', loc: 'luogo' },
  { cat: 'evento', img: 'assets/pics/foto6.jpg', couple: 'nome', loc: 'luogo' },
  { cat: 'evento', img: 'assets/pics/foto7.jpg', couple: 'nome', loc: 'luogo' },
  //{ cat: 'evento', img: 'assets/pics/fidanzamento-3.jpg', couple: 'nome', loc: 'luogo' },
];

const colors = [
  'linear-gradient(135deg,#3A241C 0%,#5B3A2E 50%,#7a4f3a 100%)',
  'linear-gradient(135deg,#2a1810 0%,#4a2e1c 50%,#6a4228 100%)',
  'linear-gradient(135deg,#1a120c 0%,#3a2418 50%,#5a3820 100%)',
  'linear-gradient(135deg,#4a3020 0%,#6a4a30 50%,#8a6040 100%)',
  'linear-gradient(135deg,#2c1a12 0%,#4c2a1a 50%,#6c3a28 100%)',
];

function catLabel(c) {
  const m = { matrimoni: 'Matrimonio', fidanzamento: 'Fidanzamento', destination: 'Destination' };
  return m[c] || c;
}

function buildMasonry(filter = 'all') {
  const grid = document.getElementById('masonry-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  const filtered = filter === 'all' ? portfolioItems : portfolioItems.filter(i => i.cat === filter);
  
  filtered.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'masonry-item';
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `${item.couple} · ${item.loc}`);
    
    // Crea l'elemento immagine - SENZA altezza fissa
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.couple;
    img.style.width = '100%';
    img.style.display = 'block';
    // RIMUOVI la riga height fissa - lascia che l'immagine abbia la sua altezza naturale
    
    // Gestione errore: se l'immagine non si carica, mostra placeholder con altezza predefinita
    img.onerror = function() {
      this.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.className = 'masonry-placeholder';
      placeholder.style.height = '320px'; // Altezza di default se manca l'immagine
      placeholder.style.background = colors[idx % colors.length];
      placeholder.innerHTML = `
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at ${30 + idx * 15}% ${40 + idx * 8}%, rgba(201,120,58,.${8 + idx % 4}) 0%,transparent 60%)"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,rgba(31,27,24,.5),transparent)"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:.2">
          <div style="font-family:var(--serif);font-size:2.5rem;font-style:italic;color:var(--ivory)">${item.couple.charAt(0)}</div>
        </div>
      `;
      div.insertBefore(placeholder, this);
    };
    
    div.appendChild(img);
    
    // Overlay e info
    const overlay = document.createElement('div');
    overlay.className = 'masonry-overlay';
    div.appendChild(overlay);
    
    const info = document.createElement('div');
    info.className = 'masonry-info';
    info.innerHTML = `
      <div class="masonry-cat">${catLabel(item.cat)}</div>
      <div class="masonry-name">${item.couple}</div>
      <div style="font-family:var(--sans);font-size:.65rem;color:rgba(217,204,170,.5);margin-top:.3rem;letter-spacing:.08em">${item.loc}</div>
    `;
    div.appendChild(info);
    
    div.addEventListener('click', () => openLightbox(idx, filtered));
    div.addEventListener('keypress', e => { if (e.key === 'Enter') openLightbox(idx, filtered); });
    grid.appendChild(div);
  });
}

// Inizializza il portfolio
buildMasonry('all');

// Filtri
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
    buildMasonry(this.dataset.filter);
  });
});

/* ─── LIGHTBOX ─── */
let lbItems=[],lbIdx=0;
function openLightbox(idx,items){
  lbItems=items;lbIdx=idx;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
  renderLb();
}
function renderLb() {
  const item = lbItems[lbIdx];
  const c = document.getElementById('lb-content');
  
  // Mostra l'immagine vera nel lightbox
  c.innerHTML = `
    <div style="text-align:center">
      <img src="${item.img}" alt="${item.couple}" style="max-width:85vw;max-height:85vh;object-fit:contain;border-radius:4px;">
      <div style="margin-top:1.5rem;text-align:center">
        <div style="font-family:var(--sans);font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--copper);margin-bottom:.4rem">${catLabel(item.cat)}</div>
        <div style="font-family:var(--serif);font-size:1.5rem;font-weight:300;color:var(--cream)">${item.couple}</div>
        <div style="font-family:var(--sans);font-size:.72rem;color:rgba(217,204,170,.6);margin-top:.3rem">${item.loc}</div>
        <div style="font-family:var(--sans);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(217,204,170,.3);margin-top:1rem">${lbIdx + 1} / ${lbItems.length}</div>
      </div>
    </div>`;
  
  // Gestione errore: se l'immagine non si carica nella lightbox
  const lbImg = c.querySelector('img');
  lbImg.onerror = () => {
    lbImg.style.display = 'none';
    lbImg.parentElement.innerHTML = `
      <div style="width:clamp(280px,60vw,700px);aspect-ratio:3/4;background:${colors[lbIdx % colors.length]};margin:0 auto;position:relative;overflow:hidden;border-radius:4px">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 40% 50%,rgba(201,120,58,.12) 0%,transparent 60%)"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(to top,rgba(31,27,24,.7),transparent)"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--serif);font-size:4rem;font-style:italic;color:rgba(217,204,170,.15)">${item.couple.charAt(0)}</div>
      </div>
      <div style="margin-top:1rem">${lbImg.parentElement.innerHTML.split('</div>').slice(1).join('</div>')}`;
  };
}
function changeLb(dir){
  lbIdx=(lbIdx+dir+lbItems.length)%lbItems.length;
  renderLb();
}
function closeLightbox(e){
  if(e.target===document.getElementById('lightbox')){
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow='';
  }
}
document.addEventListener('keydown',e=>{
  const lb=document.getElementById('lightbox');
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape'){lb.classList.remove('open');document.body.style.overflow='';}
  if(e.key==='ArrowLeft')changeLb(-1);
  if(e.key==='ArrowRight')changeLb(1);
});

/* ─── TESTIMONIALS SLIDER ─── */
let testiIndex=0;
const track=document.getElementById('testi-track');
function slideTestimonials(dir){
  const cards=track.querySelectorAll('.testimonial-card');
  const cardW=cards[0]?.offsetWidth||420;
  const gap=40;
  const max=Math.max(0,cards.length-Math.floor(track.parentElement.offsetWidth/(cardW+gap)));
  testiIndex=Math.max(0,Math.min(testiIndex+dir,max));
  track.style.transform=`translateX(-${testiIndex*(cardW+gap)}px)`;
}

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',function(){
    const item=this.closest('.faq-item');
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if(!wasOpen){
      item.classList.add('open');
      this.setAttribute('aria-expanded','true');
    }
  });
});

/* ─── CONTACT FORM ─── */
document.getElementById('contact-form').addEventListener('submit',function(e){
  e.preventDefault();
  const msg=document.getElementById('form-message');
  const sposa=document.getElementById('nome-sposa').value.trim();
  const sposo=document.getElementById('nome-sposo').value.trim();
  const email=document.getElementById('email').value.trim();
  const data=document.getElementById('data-matrimonio').value;
  const servizio=document.getElementById('servizio').value;
  if(!sposa||!sposo||!email||!data||!servizio){
    msg.textContent='Per favore compila tutti i campi obbligatori.';
    msg.style.color='rgba(201,58,50,.8)';
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    msg.textContent='L\'indirizzo email non è valido.';
    msg.style.color='rgba(201,58,50,.8)';
    return;
  }
  const btn=this.querySelector('.form-submit');
  btn.textContent='Invio in corso...';
  btn.style.opacity='.7';
  setTimeout(()=>{
    msg.textContent=`Grazie ${sposa} & ${sposo}! La vostra richiesta è stata inviata. Vi contatteremo entro 24 ore.`;
    msg.style.color='rgba(201,120,58,.9)';
    btn.textContent='Messaggio Inviato ✓';
    btn.style.background='rgba(80,160,80,.8)';
    btn.style.opacity='1';
    this.reset();
  },1500);
});

/* ─── SMOOTH ACTIVE NAV ─── */
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-links a');
const sectionObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(l=>{
        l.style.color=l.getAttribute('href')==='#'+e.target.id?'var(--cream)':'rgba(233,223,194,.75)';
      });
    }
  });
},{threshold:.3});
sections.forEach(s=>sectionObs.observe(s));

/* ─── PARALLAX HERO ─── */
window.addEventListener('scroll',()=>{
  const hero=document.getElementById('hero');
  const scrolled=window.scrollY;
  if(scrolled<window.innerHeight){
    const bg=hero.querySelector('.hero-bg');
    if(bg)bg.style.transform=`translateY(${scrolled*.3}px)`;
    const content=hero.querySelector('.hero-content');
    if(content)content.style.transform=`translateY(${scrolled*.15}px)`;
    const scroll=hero.querySelector('.hero-scroll');
    if(scroll)scroll.style.opacity=1-scrolled/300;
  }
},{passive:true});

/* ─── VIDEO PLACEHOLDER INTERACTION ─── */
document.querySelectorAll('.video-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const ph=card.querySelector('.video-placeholder');
    if(ph){
      ph.style.opacity='0';
      ph.style.transition='opacity .3s';
      setTimeout(()=>{
        ph.innerHTML=`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1rem;padding:2rem;text-align:center">
          <div style="font-family:var(--serif);font-size:1.1rem;font-style:italic;color:var(--ivory)">Integrazione video disponibile</div>
          <div style="font-family:var(--sans);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(217,204,170,.5)">Aggiungi l'URL Vimeo o YouTube nel codice</div>
        </div>`;
        ph.style.opacity='1';
      },300);
    }
  });
});
