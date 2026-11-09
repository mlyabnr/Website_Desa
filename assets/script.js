document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const AUTH_KEY = 'desa-klis-auth';
  const getCurrentUser = () => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  };

  const setCurrentUser = (user) => {
    if (!user) {
      localStorage.removeItem(AUTH_KEY);
      return;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  };

  const updateAuthUI = () => {
    const loginLink = document.querySelector('[data-login-link]');
    const logoutButton = document.querySelector('[data-logout-button]');
    const userBadge = document.querySelector('[data-user-badge]');
    const currentUser = getCurrentUser();

    if (loginLink) {
      loginLink.classList.toggle('hidden', Boolean(currentUser));
    }

    if (logoutButton) {
      logoutButton.classList.toggle('hidden', !currentUser);
    }

    if (userBadge) {
      if (currentUser) {
        userBadge.textContent = `Halo, ${currentUser.name}`;
        userBadge.classList.remove('hidden');
      } else {
        userBadge.classList.add('hidden');
      }
    }
  };

  updateAuthUI();

  const logoutButton = document.querySelector('[data-logout-button]');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      setCurrentUser(null);
      updateAuthUI();
      window.location.href = 'index.html';
    });
  }

  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = document.getElementById('username')?.value.trim() || '';
      const password = document.getElementById('password')?.value.trim() || '';

      const showMessage = (message, isError) => {
        if (!loginMessage) return;
        loginMessage.hidden = false;
        loginMessage.textContent = message;
        loginMessage.classList.remove('success', 'error');
        loginMessage.classList.add(isError ? 'error' : 'success');
      };

      if (username.toLowerCase() !== 'admin' || password !== 'desa123') {
        showMessage('Username atau password salah. Gunakan admin / desa123.', true);
        return;
      }

      setCurrentUser({ name: 'Admin Desa' });
      showMessage('Login berhasil. Mengalihkan ke halaman utama...', false);
      updateAuthUI();

      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    });
  }

  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const subject = (formData.get('subject') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !subject || !message) {
        alert('Mohon lengkapi semua field sebelum mengirim pesan.');
        return;
      }

      const text = `Halo Pemerintah Desa Klis, saya ${name}.%0AEmail: ${email}%0A%0ASubjek: ${subject}%0A%0APesan:%0A${message}`;
      const whatsappLink = `https://wa.me/6281234567890?text=${text}`;

      window.open(whatsappLink, '_blank');

      if (successMessage) {
        successMessage.hidden = false;
        successMessage.textContent = 'Pesan Anda sedang dibuka di WhatsApp.';
      }

      contactForm.reset();
    });
  }
});
