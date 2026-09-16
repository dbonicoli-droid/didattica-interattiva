(() => {
  'use strict';
  function init() {
    const links = document.querySelectorAll('a[data-glossary-definition]');
    if (!links.length) return;
    const tooltip = document.createElement('div');
    tooltip.id = 'course-glossary-tooltip';
    tooltip.className = 'glossary-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    const title = document.createElement('strong');
    const definition = document.createElement('span');
    tooltip.append(title, definition);
    document.body.append(tooltip);
    let active = null, timer = null;
    function hide() {
      clearTimeout(timer);
      if (active) {
        const ids = (active.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== tooltip.id);
        if (ids.length) active.setAttribute('aria-describedby', ids.join(' '));
        else active.removeAttribute('aria-describedby');
      }
      active = null;
      tooltip.hidden = true;
    }
    function position() {
      if (!active) return;
      const rect = active.getBoundingClientRect();
      const box = tooltip.getBoundingClientRect();
      const left = Math.max(12, Math.min(innerWidth - box.width - 12, rect.left));
      let top = rect.bottom + 8;
      if (top + box.height > innerHeight - 12) top = Math.max(12, rect.top - box.height - 8);
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }
    function show(link) {
      clearTimeout(timer);
      if (active !== link) hide();
      active = link;
      title.textContent = link.dataset.glossaryTitle;
      definition.textContent = link.dataset.glossaryDefinition;
      const ids = new Set((link.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      ids.add(tooltip.id);
      link.setAttribute('aria-describedby', [...ids].join(' '));
      tooltip.hidden = false;
      position();
    }
    function scheduleHide() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!tooltip.matches(':hover') && active !== document.activeElement) hide();
      }, 180);
    }
    links.forEach(link => {
      link.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'touch') show(link);
      });
      link.addEventListener('pointerleave', scheduleHide);
      link.addEventListener('focus', () => show(link));
      link.addEventListener('blur', scheduleHide);
      // Preserve the ordinary link, including touch and keyboard activation.
      link.addEventListener('click', hide);
    });
    tooltip.addEventListener('pointerenter', () => clearTimeout(timer));
    tooltip.addEventListener('pointerleave', scheduleHide);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
    window.addEventListener('resize', position);
    window.addEventListener('scroll', hide, {passive: true, capture: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
