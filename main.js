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

// Contact form — Web3Forms
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

    const submitBtn = form.querySelector('button[type=submit]');
    const errorEl   = document.getElementById('formError');

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';
    errorEl.classList.add('hidden');

    // key assembled at runtime — restrict domain in web3forms.com dashboard for full protection
    const _p1 = atob('ZmFiY2ExODYtMmJjOQ==');   // fabca186-2bc9
    const _p2 = atob('LTRmNGEtODcyMQ==');         // -4f4a-8721
    const _p3 = atob('LTI2YWQzYjBkZGU3NA==');     // -26ad3b0dde74
    const data = {
      access_key: _p1 + _p2 + _p3,
      subject:    form.querySelector('[name=subject]').value,
      from_name:  form.querySelector('[name=from_name]').value,
      name:    form.querySelector('#name').value.trim(),
      phone:   form.querySelector('#phone').value.trim(),
      email:   form.querySelector('#email').value.trim(),
      message: form.querySelector('#message').value.trim() || '—',
    };

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        showSuccess();
      } else {
        throw new Error(json.message || 'error');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
      errorEl.classList.remove('hidden');
      console.error('Form error:', err);
    }
  });
}

function showSuccess() {
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');
  const submitBtn = form && form.querySelector('button[type=submit]');
  if (!form || !success) return;

  form.querySelectorAll('input:not([type=checkbox]):not([type=hidden]), textarea').forEach(el => {
    el.value = '';
    el.classList.remove('error');
  });
  form.querySelector('#privacy').checked = false;

  submitBtn.textContent = 'Отправить заявку';
  submitBtn.disabled = false;
  success.classList.remove('hidden');
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setTimeout(() => success.classList.add('hidden'), 6000);
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
