const svcData = {
  bruta: {
    title: "Limpeza Grossa Pós-Obra",
    desc: "Serviço inicial destinado à remoção de resíduos e sujidade grossa. Inclui: varredura, recolha de entulhos e limpeza de superfícies grossas.",
    benefits: ["Remoção eficaz de entulhos", "Limpeza de superfícies e rodapés", "Preparação para limpeza fina"],
    phone: "351931860324"
  },
  fina: {
    title: "Limpeza Fina Pós-Obra",
    desc: "Limpeza minuciosa e detalhada de todas as superfícies, eliminando poeiras finas e manchas. Inclui: lavagem de superfícies, aspiração fina e remoção de marcas.",
    benefits: ["Acabamento final de alta qualidade", "Valorização de materiais e acabamentos", "Espaço pronto a usar"],
    phone: "351931860324"
  },
  vidros: {
    title: "Higienização de Vidros e Caixilharias",
    desc: "Limpeza especializada de vidros, janelas, portas envidraçadas e caixilharias, garantindo transparência, brilho e preservação dos materiais. Inclui: limpeza de vidros interiores/exteriores e perfis.",
    benefits: ["Vidros sem manchas e marcas", "Preservação das caixilharias", "Aumento da luminosidade natural"],
    phone: "351931860324"
  },
  preparo: {
    title: "Preparação do Ambiente para Uso Imediato",
    desc: "Serviço completo para deixar o espaço organizado e utilizável após a obra. Inclui: organização, limpeza final e verificação de áreas críticas.",
    benefits: ["Redução do tempo até utilização", "Maior conforto funcional", "Entrega com padrão profissional"],
    phone: "351931860324"
  }
};

/* Utilities */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

/* Year */
qs('#year').textContent = new Date().getFullYear();

/* Smooth scroll for in-page links */
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      // if navigating to Antes e Depois, reveal it; otherwise ensure it's hidden
      if(href === '#antes-depois') {
        if(antesSection) {
          antesSection.style.display = 'block';
          antesSection.setAttribute('aria-hidden','false');
        }
      } else {
        if(typeof hideAntesSection === 'function') hideAntesSection();
      }
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile nav if open
      qs('#navList').classList.remove('show');
      qs('#navToggle').setAttribute('aria-expanded','false');
    }
  });
});

/* Nav dropdown behavior restored to default (CSS/interaction controls it).
   Add interactive services dropdown: clicking "Serviços" toggles the submenu; clicking a service button scrolls to the services section,
   opens the modal with corresponding content and closes other navs. The dropdown shows short descriptions matching the page cards. */
const servToggle = qs('#servicosToggle');
const servDropdown = qs('#servDropdown');
if(servToggle && servDropdown){
  servToggle.addEventListener('click', (e)=>{
    e.preventDefault();
    // hide Antes e Depois when other dropdowns are opened
    if(typeof hideAntesSection === 'function') hideAntesSection();
    const open = servDropdown.style.display === 'block';
    // close videos dropdown if open
    const videosDd = qs('#videosDropdown');
    if(videosDd) videosDd.style.display = 'none';
    servDropdown.style.display = open ? 'none' : 'block';
    servDropdown.setAttribute('aria-hidden', open ? 'true' : 'false');
  });

  // when clicking a service entry in the dropdown: scroll to section, highlight and optionally open modal
  servDropdown.querySelectorAll('.service-link').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const key = btn.dataset.service;
      // close dropdown
      servDropdown.style.display = 'none';
      servDropdown.setAttribute('aria-hidden','true');
      // close mobile nav if open
      qs('#navList').classList.remove('show');
      qs('#navToggle').setAttribute('aria-expanded','false');

      // smooth scroll to services
      const el = document.querySelector('#servicos');
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});

      // small visual highlight on the matching card
      const card = document.querySelector(`.card[data-service="${key}"]`);
      if(card){
        card.style.boxShadow = '0 18px 40px rgba(6,49,78,0.14)';
        setTimeout(()=> card.style.boxShadow = '', 1200);
      }

      // open modal with service details for quick info (same content as cards)
      if(typeof openService === 'function' && key) {
        openService(key);
      }
    });
  });

  // close services dropdown when clicking outside
  document.addEventListener('click', (e)=>{
    const inside = e.target.closest('#servDropdown') || e.target.closest('#servicosToggle');
    if(!inside) {
      servDropdown.style.display = 'none';
      servDropdown.setAttribute('aria-hidden','true');
    }
  });
}
/* Videos dropdown toggle: show/hide on click and close when selecting or when other navs open */
const videosToggle = qs('#videosToggle');
const videosDropdown = qs('#videosDropdown');
if(videosToggle && videosDropdown){
  videosToggle.addEventListener('click', (e)=>{
    e.preventDefault();
    // hide Antes e Depois when other dropdowns are opened
    if(typeof hideAntesSection === 'function') hideAntesSection();
    // toggle display
    const open = videosDropdown.style.display === 'block';
    // hide other dropdowns
    const servDd = qs('#servDropdown');
    if(servDd) servDd.style.display = 'none';
    videosDropdown.style.display = open ? 'none' : 'block';
  });

  // close videos dropdown when clicking any item inside (buttons, not links)
  videosDropdown.querySelectorAll('button.video-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // currently no external link; just close the dropdown and mobile nav
      videosDropdown.style.display = 'none';
      qs('#navList').classList.remove('show');
      qs('#navToggle').setAttribute('aria-expanded','false');
      // future: attach video preview behavior here
    });
  });

  // close videos dropdown when clicking outside
  document.addEventListener('click', (e)=>{
    const inside = e.target.closest('#videosDropdown') || e.target.closest('#videosToggle');
    if(!inside) videosDropdown.style.display = 'none';
  });
}

/* Mobile nav toggle */
qs('#navToggle').addEventListener('click', ()=>{
  const list = qs('#navList');
  const open = list.classList.toggle('show');
  qs('#navToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* Service modal logic */
const modal = qs('#serviceModal');
const svcTitle = qs('#svcTitle');
const svcDesc = qs('#svcDesc');
const svcBenefits = qs('#svcBenefits');
const svcQuote = qs('#svcQuote');
const svcClose = qs('#svcClose');
const modalClose = qs('#modalClose');

function openService(key){
  const s = svcData[key];
  svcTitle.textContent = s.title;
  svcDesc.textContent = s.desc;
  svcBenefits.innerHTML = s.benefits.map(b=>`<li>${b}</li>`).join('');
  svcQuote.onclick = ()=> openWhatsApp(s.phone, `${s.title} - Solicito orçamento. Local/metros/observações:`)
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}
qsa('.service-open').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const key = btn.closest('.card').dataset.service;
    openService(key);
  });
});
/* Service menu links now scroll to the Services section (href="#servicos" handles smooth scroll).
   Also ensure dropdown and mobile nav close after selection. */
qsa('.service-link').forEach(a=>{
  a.addEventListener('click', ()=>{
    // close dropdown
    qs('#servDropdown').style.display = 'none';
    // close mobile nav if open
    qs('#navList').classList.remove('show');
    qs('#navToggle').setAttribute('aria-expanded','false');
  });
});
svcClose.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=> { if(e.target===modal) closeModal(); });

/* WhatsApp handlers */
function openWhatsApp(phone, text = 'Olá, gostaria de um orçamento de limpeza pós-obra.'){
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
qs('#fabWhats').addEventListener('click', ()=> openWhatsApp('351931860324','Olá, gostaria de um orçamento de limpeza pós-obra.'));
qs('#whatsappHero').addEventListener('click', ()=> openWhatsApp('351931860324','Olá, solicito orçamento - J&F Limpeza Pós-Obra.'));
qs('#quoteBtn').addEventListener('click', ()=> openWhatsApp('351931860324','Olá, solicito orçamento - J&F Limpeza Pós-Obra.'));
qsa('.cta-strong .whatsapp').forEach(btn=>{
  btn.addEventListener('click', ()=> openWhatsApp(btn.dataset.phone, 'Olá, solicito orçamento - J&F Limpeza Pós-Obra.'));
});

/* Update visible button labels without changing structure/links */
qs('#quoteBtn').textContent = 'Solicitar Orçamento Gratuito';
qsa('.service-open').forEach(b=> b.textContent = 'Solicitar Orçamento Gratuito');
qsa('.btn.whatsapp').forEach(b=>{
  if(b.id === 'whatsappHero') return; /* already set above */
  if(b.closest('.cta-strong')) b.textContent = 'Falar com Especialista no WhatsApp';
});
qsa('.nav-list a, .footer-nav a').forEach(a=>{
  /* keep navigation labels intact */
});

/* Before/After comparator removed — replaced by a static responsive image in the DOM.
   Old range/mini interaction code intentionally disabled to avoid console errors. */

/* Hover animations for buttons are in CSS; add small click feedback */
qsa('.btn').forEach(b=>{
  b.addEventListener('mousedown', ()=> b.style.transform='scale(0.98)');
  b.addEventListener('mouseup', ()=> b.style.transform='scale(1)');
  b.addEventListener('mouseleave', ()=> b.style.transform='scale(1)');
});

/* Accessibility: close modal with ESC */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeModal();
});

/* --- New behavior: ensure links and images open as expected --- */
/* 1) Force external links (absolute URLs or mailto/tel) to open in a new tab with security rel */
qsa('a[href]').forEach(a=>{
  try{
    const href = a.getAttribute('href') || '';
    // leave in-page anchors untouched
    if(href.startsWith('#')) return;
    // force external, tel, mailto, and full URLs to open in new tab
    a.setAttribute('target','_blank');
    // security best practice
    if(!a.getAttribute('rel')) a.setAttribute('rel','noopener noreferrer');
  }catch(e){}
});

/* 2) Make images that are visible clickable to open their source in a new tab.
      Add class 'clickable-img' to control cursor; skip decorative images (aria-hidden or role=presentation) */
qsa('img').forEach(img=>{
  if(img.closest('a')) {
    // if already inside a link, ensure that link opens (handled above) and skip adding another handler
    return;
  }
  const ariaHidden = img.getAttribute('aria-hidden');
  const role = img.getAttribute('role');
  if(ariaHidden === 'true' || role === 'presentation') return;
  // mark as clickable visually
  img.classList.add('clickable-img');
  img.style.touchAction = 'manipulation';
  img.addEventListener('click', (e)=>{
    const src = img.getAttribute('src');
    if(!src) return;
    // open the image source in a new tab
    window.open(src, '_blank', 'noopener');
  });
  // keyboard accessibility: allow Enter/Space to open
  img.setAttribute('tabindex','0');
  img.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const src = img.getAttribute('src');
      if(src) window.open(src, '_blank', 'noopener');
    }
  });
});

/* 3) Ensure iframes that point to external hosts open their src URL in a new tab when clicked (map/video).
      We won't change iframe behavior, but provide a small overlay button for map iframe to open in new tab for easier viewing. */
const footerMap = qs('.footer-map');
if(footerMap){
  const iframe = footerMap.querySelector('iframe');
  if(iframe){
    const overlayBtn = document.createElement('button');
    overlayBtn.type = 'button';
    overlayBtn.textContent = 'Abrir mapa';
    overlayBtn.className = 'overlay-open-map';
    overlayBtn.style.position='absolute';
    overlayBtn.style.right='12px';
    overlayBtn.style.top='12px';
    overlayBtn.style.zIndex='60';
    overlayBtn.style.padding='6px 10px';
    overlayBtn.style.borderRadius='8px';
    overlayBtn.style.border='0';
    overlayBtn.style.background='rgba(255,255,255,0.95)';
    overlayBtn.style.color='var(--blue)';
    overlayBtn.style.cursor='pointer';
    // ensure footer-map is positioned relative so overlay sits on top
    footerMap.style.position = footerMap.style.position || 'relative';
    footerMap.appendChild(overlayBtn);
    overlayBtn.addEventListener('click', ()=>{
      const src = iframe.getAttribute('src');
      if(src) window.open(src, '_blank', 'noopener');
    });
  }
}

/* --- Banner slideshow: automatic fade loop using local assets (no controls visible) --- */
(function initBannerSlideshow(){
  try{
    const slides = Array.from(document.querySelectorAll('.banner-slide'));
    if(!slides.length) return;
    let current = 0;
    const total = slides.length;
    const intervalMs = 4500; // switch every 4.5s (between 4–5s as requested)
    slides.forEach((s,i)=>{
      s.style.transition = 'opacity 900ms ease-in-out';
      if(i === 0) s.classList.add('active');
    });
    setInterval(()=>{
      const prev = current;
      current = (current + 1) % total;
      slides[prev].classList.remove('active');
      slides[current].classList.add('active');
    }, intervalMs);
  }catch(e){console.error('Slideshow init error', e)}
})();

/* --- Antes e Depois reveal + simple gallery lightbox (uses local image files and preserves anchors) --- */
const antesLink = qs('a[href="#antes-depois"]');
const antesSection = qs('#antes-depois');
const seoWrap = qs('.seo-micro-wrap');

function hideAntesSection(){
  if(!antesSection) return;
  antesSection.style.display = 'none';
  antesSection.setAttribute('aria-hidden','true');
}

if(antesLink && antesSection && seoWrap){
  antesLink.addEventListener('click', (e)=>{
    e.preventDefault();
    // reveal section (was hidden by default)
    antesSection.style.display = 'block';
    antesSection.setAttribute('aria-hidden','false');

    // small delay to allow layout then scroll to just below the video title block
    setTimeout(()=>{
      // scroll so the end of seo-micro-wrap is aligned (i.e., position just below the video)
      seoWrap.scrollIntoView({behavior:'smooth', block:'end'});
      // focus the revealed section for accessibility
      antesSection.setAttribute('tabindex','-1');
      antesSection.focus({preventScroll:true});
    }, 80);
  });
}

/* Gallery lightbox handlers */
const lightbox = qs('#imgLightbox');
const lightboxImg = qs('#imgLightboxImg');
const lightboxClose = qs('#imgLightboxClose');

qsa('.ba-thumb').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const src = btn.dataset.src;
    if(!src) return;
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden','false');
    // prevent body scroll while open
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox(){
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden','true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}
if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if(lightbox) lightbox.addEventListener('click', (e)=> { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeLightbox(); });