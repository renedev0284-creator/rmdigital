document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('servicesPricing');
  if (!mount) return;

  const JSON_URL = 'data/servicios.json';

  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const fmtMoney = (value, currency) => {
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0
    }).format(n);
  };

  const waLink = (phoneE164, text) => {
    const msg = encodeURIComponent(text || 'Hola, me interesa una cotización.');
    return `https://wa.me/${phoneE164}?text=${msg}`;
  };

  const iconSvg = (name) => {
    // íconos simples inline (podés cambiarlos por los tuyos)
    const common = 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"';
    if (name === 'globe') return `<svg ${common}><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15 15 0 0 1 0 20"></path></svg>`;
    if (name === 'megaphone') return `<svg ${common}><path d="M3 11l18-5v12L3 13v-2z"></path><path d="M11 16v5"></path><path d="M7 15.5v4.5"></path></svg>`;
    return `<svg ${common}><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>`;
  };

  const render = (data) => {
    const currency = data.currency || 'USD';
    const phone = data.whatsapp?.phoneE164 || '50245610507';
    const baseText = data.whatsapp?.defaultText || 'Hola, me interesa una cotización.';

    const html = (data.services || []).map(service => {
      const sTitle = escapeHtml(service.title);
      const sSubtitle = escapeHtml(service.subtitle);
      const sIcon = iconSvg(service.icon);
      const tags = (service.tags || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('');

      const plans = (service.plans || []).map(plan => {
        const price = fmtMoney(plan.price, currency);
        const period = escapeHtml(plan.period || '');
        const badge = plan.badge ? `<div class="plan-badge">${escapeHtml(plan.badge)}</div>` : '';
        const features = (plan.features || []).map(f => `<li>✓ ${escapeHtml(f)}</li>`).join('');

        const text = `${baseText}\n\nServicio: ${service.title}\nPlan: ${plan.name}\nPrecio: ${price} (${plan.period})`;
        const link = waLink(phone, text);

        return `
          <div class="plan-card ${plan.highlight ? 'is-highlight' : ''}">
            ${badge}
            <div class="plan-head">
              <div class="plan-name">${escapeHtml(plan.name)}</div>
              <div class="plan-price">${price} <span class="plan-period">/ ${period}</span></div>
            </div>
            <ul class="plan-features">${features}</ul>
            <a class="btn btn-primary plan-cta" target="_blank" rel="noopener" href="${link}">
              Pedir por WhatsApp
            </a>
          </div>
        `;
      }).join('');

      return `
        <section class="service-block fade-up">
          <div class="service-head">
            <div class="service-icon">${sIcon}</div>
            <div class="service-meta">
              <h3>${sTitle}</h3>
              <p>${sSubtitle}</p>
              <div class="service-tags">${tags}</div>
            </div>
          </div>
          <div class="plans-grid">
            ${plans}
          </div>
        </section>
      `;
    }).join('');

    mount.innerHTML = `
      <div class="pricing-wrap">
        ${html}
      </div>
    `;
  };

  fetch(JSON_URL, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(render)
    .catch(err => {
      console.error('No se pudo cargar servicios.json:', err);
      mount.innerHTML = `
        <div class="alert">
          No se pudieron cargar los planes en este momento.
        </div>
      `;
    });
});
