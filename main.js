// Header scroll effect
const header = document.getElementById('top') && document.querySelector('.header');
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

// Contact form — sends via mailto as fallback (static hosting)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
        field.classList.add('error');
        valid = false;
      }
    });
    if (!valid) return;

    const name = form.querySelector('#name').value.trim();
    const org = form.querySelector('#org').value.trim();
    const email = form.querySelector('#email').value.trim();
    const city = form.querySelector('#city').value.trim();
    const message = form.querySelector('#message').value.trim();

    const body = encodeURIComponent(
      `Имя: ${name}\nОрганизация: ${org}\nEmail: ${email}\nГород: ${city}\n\nПроект:\n${message}`
    );
    const subject = encodeURIComponent(`Заявка с сайта — ${name}`);

    // Try FormSubmit.co (free static form service) first
    try {
      const res = await fetch('https://formsubmit.co/ajax/lightstylemeb@yandex.ru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, org, city, message, _subject: `Заявка с сайта — ${name}`, _captcha: 'false' })
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) {
        showSuccess();
        return;
      }
    } catch (_) {/* fallback */}

    // Fallback: open mailto
    window.location.href = `mailto:lightstylemeb@yandex.ru?subject=${subject}&body=${body}`;
    showSuccess();
  });
}

function showSuccess() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.querySelectorAll('input, textarea, button[type=submit]').forEach(el => el.disabled = true);
    success.classList.remove('hidden');
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .adv__card, .process__step, .contact__block').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Apply in-view state
const style = document.createElement('style');
style.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
