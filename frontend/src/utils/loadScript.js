export default function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('Failed to load '+src));
    document.body.appendChild(s);
  });
}
