// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  const backTop = document.getElementById('backTop');
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
});

// Burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
    });
  });
}

// Catalog tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    tab.classList.add('tab--active');
    const target = tab.dataset.tab;
    document.querySelectorAll('.catalog__grid').forEach(grid => {
      grid.classList.toggle('hidden', grid.id !== 'tab-' + target);
    });
  });
});

// Phone formatting helper (basic)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (v.length > 11) v = v.slice(0, 11);
    phoneInput.value = v.length ? '+' + v : '';
  });
}

// Contact form
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (field.type === 'checkbox') {
        if (!field.checked) { field.classList.add('error'); valid = false; }
      } else {
        if (!field.value.trim()) { field.classList.add('error'); valid = false; }
      }
    });
    if (!valid) return;

    const name    = form.querySelector('#name').value.trim();
    const phone   = form.querySelector('#phone').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Try FormSubmit.co (free static form service)
    let sent = false;
    try {
      const res = await fetch('https://formsubmit.co/ajax/lightstylemeb@yandex.ru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name, phone, email, message,
          _subject: `Заявка с сайта — ${name}`,
          _captcha: 'false'
        })
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) sent = true;
    } catch (_) { /* fallback */ }

    if (!sent) {
      // Fallback: open mailto
      const body = encodeURIComponent(`Имя: ${name}\nТелефон: ${phone}\nEmail: ${email}\n\nПроект:\n${message}`);
      const subject = encodeURIComponent(`Заявка с сайта — ${name}`);
      window.location.href = `mailto:lightstylemeb@yandex.ru?subject=${subject}&body=${body}`;
    }

    showSuccess();
  });
}

function showSuccess() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  // Clear all input/textarea fields
  form.querySelectorAll('input:not([type=checkbox]):not([type=submit]), textarea').forEach(el => {
    el.value = '';
    el.classList.remove('error');
  });
  form.querySelector('#privacy').checked = false;

  // Disable submit while showing success
  const submitBtn = form.querySelector('button[type=submit]');
  if (submitBtn) submitBtn.disabled = true;

  success.classList.remove('hidden');
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Re-enable after 5 seconds
  setTimeout(() => {
    success.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = false;
  }, 5000);
}

// Animate elements on scroll
const style = document.createElement('style');
style.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .adv__card, .process__step, .contact__block').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
