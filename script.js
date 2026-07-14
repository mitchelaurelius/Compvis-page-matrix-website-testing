document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Countdown ---------- */
  const target = new Date('2026-09-29T06:00:00+07:00').getTime();
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');

  function pad(n){ return String(n).padStart(2,'0'); }

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000); diff -= days*86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours*3600000;
    const mins = Math.floor(diff / 60000); diff -= mins*60000;
    const secs = Math.floor(diff / 1000);
    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Folder tabs (company list) ---------- */
  const tabs = document.querySelectorAll('.folder-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.dataset.active = 'false');
      tab.dataset.active = 'true';
      const target = tab.dataset.target;
      document.querySelectorAll('.papers').forEach(p => {
        if (p.id === `papers-${target}`){
          p.classList.remove('hidden');
          // restart animation
          p.style.animation = 'none';
          void p.offsetWidth;
          p.style.animation = '';
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- Mobile burger ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  const navAuth = document.querySelector('.nav-auth');
  burger.addEventListener('click', () => {
    const show = navLinks.style.display === 'flex';
    navLinks.style.display = show ? 'none' : 'flex';
    navAuth.style.display = show ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navAuth.style.flexDirection = 'row';
    if (!show){
      navLinks.style.position = 'absolute';
      navLinks.style.top = '58px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(22,35,74,.98)';
      navLinks.style.padding = '20px';
      navLinks.style.gap = '18px';
    }
  });

  /* ---------- Registration form ---------- */
  const formSteps = document.querySelectorAll('.form-step');
  const stepIndicators = document.querySelectorAll('.step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const personsWrap = document.getElementById('personsWrap');
  let currentStep = 1;
  const totalSteps = formSteps.length;

  function ticketCount(){
    const val = document.querySelector('input[name="ticket"]:checked').value;
    return val === 'single' ? 1 : val === 'bundle3' ? 3 : 5;
  }

  function buildPersonBlocks(){
    const count = ticketCount();
    personsWrap.innerHTML = '';
    for (let i = 1; i <= count; i++){
      const block = document.createElement('div');
      block.className = 'person-block';
      block.innerHTML = `
        <h4>Person ${i}</h4>
        <div class="field"><label>Nama Lengkap</label><input type="text" required></div>
        <div class="field"><label>NPM</label><input type="text" required></div>
        <div class="field"><label>Program Studi</label>
          <select required>
            <option value="">Pilih salah satu</option>
            <option>Matematika</option>
            <option>Statistika</option>
            <option>Ilmu Aktuaria</option>
          </select>
        </div>
        <div class="field"><label>Kontak (Line / No. HP)</label><input type="text" required></div>
        <div class="field"><label>Email</label><input type="email" required></div>
        <label class="upload-field">
          <input type="file" accept="image/*">
          Upload Screenshot Jadwal Kelas pada SIAK NG
        </label>`;
      personsWrap.appendChild(block);
    }
  }
  buildPersonBlocks();
  document.querySelectorAll('input[name="ticket"]').forEach(r => r.addEventListener('change', buildPersonBlocks));

  function showStep(n){
    formSteps.forEach(fs => fs.classList.toggle('active', Number(fs.dataset.formStep) === n));
    stepIndicators.forEach(s => {
      const step = Number(s.dataset.step);
      s.classList.toggle('active', step === n);
      s.classList.toggle('done', step < n);
    });
    prevBtn.disabled = n === 1;
    nextBtn.textContent = n === totalSteps ? 'Done' : (n === totalSteps - 1 ? 'Submit' : 'Next');
    if (n === totalSteps){ nextBtn.style.display = 'none'; prevBtn.style.display = 'none'; }
    else { nextBtn.style.display = ''; prevBtn.style.display = ''; }
  }

  nextBtn.addEventListener('click', () => {
    // basic validation of visible required fields
    const activeStep = document.querySelector('.form-step.active');
    const requiredFields = activeStep.querySelectorAll('[required]');
    for (const field of requiredFields){
      if (!field.reportValidity()) return;
    }
    if (currentStep < totalSteps){
      currentStep++;
      showStep(currentStep);
      document.getElementById('registration').scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1){
      currentStep--;
      showStep(currentStep);
    }
  });

  showStep(currentStep);
});
