// Shared Calendly popup. Single source for main site + blog.
(function(){
  if (document.getElementById('calPopup')) return;
  document.body.insertAdjacentHTML('beforeend', "<!-- CALENDLY POPUP -->\n<div id=\"calPopup\" style=\"\n  position:fixed;inset:0;z-index:99998;\n  display:flex;align-items:center;justify-content:center;\n  background:rgba(6,6,6,0.85);\n  backdrop-filter:blur(12px);\n  -webkit-backdrop-filter:blur(12px);\n  opacity:0;pointer-events:none;\n  transition:opacity 0.5s ease;\n\">\n  <div style=\"\n    background:var(--dark);\n    border:1px solid var(--border-bright);\n    max-width:480px;width:90%;\n    position:relative;\n    overflow:hidden;\n  \">\n    <!-- Gold top line -->\n    <div style=\"position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,var(--gold-dim),var(--gold),var(--gold-dim));\"></div>\n\n    <!-- Close button -->\n    <button onclick=\"closeCalPopup()\" style=\"\n      position:absolute;top:16px;right:16px;\n      background:none;border:none;\n      color:var(--text-muted);font-size:18px;\n      cursor:pointer;line-height:1;\n      transition:color 0.2s;\n    \" onmouseover=\"this.style.color='var(--gold)'\" onmouseout=\"this.style.color='var(--text-muted)'\">&#10005;</button>\n\n    <div style=\"padding:52px 48px;\">\n      <!-- Availability badge -->\n      <div style=\"display:flex;align-items:center;gap:10px;margin-bottom:24px;\">\n        <div style=\"width:6px;height:6px;border-radius:50%;background:#6BCB77;box-shadow:0 0 0 0 rgba(107,203,119,0.5);animation:pulse-g 2.5s ease-in-out infinite;\"></div>\n        <span style=\"font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#6BCB77;\">Available for select engagements</span>\n      </div>\n\n      <!-- Heading -->\n      <div style=\"font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,40px);font-weight:300;line-height:1.1;color:var(--text);margin-bottom:12px;\">\n        Let's talk about<br><em style=\"color:var(--gold);font-style:italic;\">your business.</em>\n      </div>\n\n      <!-- Sub -->\n      <p style=\"font-size:14px;line-height:1.75;color:var(--text-muted);margin-bottom:36px;\">\n        30 minutes. No pitch. Just a direct conversation about your marketing and what would actually move the needle.\n      </p>\n\n      <!-- CTA buttons -->\n      <div style=\"display:flex;flex-direction:column;gap:12px;\">\n        <a href=\"https://calendly.com/me-robbiehodge/30min\" target=\"_blank\" onclick=\"closeCalPopup()\" style=\"\n          display:block;text-align:center;\n          background:var(--gold);color:var(--black);\n          font-size:11px;letter-spacing:0.2em;text-transform:uppercase;\n          padding:16px 32px;text-decoration:none;font-weight:500;\n          transition:background 0.3s;\n        \" onmouseover=\"this.style.background='#E8C97A'\" onmouseout=\"this.style.background='var(--gold)'\">\n          Book a 30-Minute Call\n        </a>\n        <button onclick=\"closeCalPopup()\" style=\"\n          background:none;border:1px solid var(--border);\n          color:var(--text-muted);font-size:11px;\n          letter-spacing:0.2em;text-transform:uppercase;\n          padding:14px 32px;cursor:pointer;\n          font-family:'DM Sans',sans-serif;\n          transition:border-color 0.3s,color 0.3s;\n          width:100%;\n        \" onmouseover=\"this.style.borderColor='var(--gold)';this.style.color='var(--gold)'\" onmouseout=\"this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'\">\n          Maybe later\n        </button>\n      </div>\n    </div>\n  </div>\n</div>");
})();

(function() {
  // Only show once per session
  if (sessionStorage.getItem('calPopupSeen')) return;

  setTimeout(function() {
    const popup = document.getElementById('calPopup');
    if (!popup) return;
    popup.style.opacity = '1';
    popup.style.pointerEvents = 'all';
  }, 7000);

  // Close on backdrop click
  document.getElementById('calPopup').addEventListener('click', function(e) {
    if (e.target === this) closeCalPopup();
  });
})();

function closeCalPopup() {
  const popup = document.getElementById('calPopup');
  popup.style.opacity = '0';
  popup.style.pointerEvents = 'none';
  sessionStorage.setItem('calPopupSeen', '1');
}

