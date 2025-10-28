// src/theme.js
export function initTheme() {
  const saved = localStorage.getItem('journey-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

export function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  if (cur === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('journey-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('journey-theme', 'dark');
  }
}