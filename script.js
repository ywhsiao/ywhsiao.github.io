const terminal = document.querySelector('[data-terminal]');
const output = document.querySelector('[data-output]');
const live = document.querySelector('[data-live]');
const demoButton = document.querySelector('[data-demo]');
let current = '';
let timer = null;
let runningDemo = false;

const responses = {
  help: 'commands: about, news, research, projects, publications, awards, teaching/service, contact, clear',
  about: 'Yi-Wen Hsiao - Researcher interested in AI, data, and health.',
  news: 'Latest: Our PREDICT Breast update manuscript was accepted with minor revision at the Journal of the National Comprehensive Cancer Network (IF: 17.5)!',
  research: 'interests: machine learning, AI for health, biomedical data, responsible AI.',
  projects: 'Customized Single-Cell RNA-seq Workflow; RNA-Editing Analysis Pipeline',
  publications: 'Noel et al. 2026; Pharoah et al. 2025; Hsiao et al. 2025',
  awards: 'Golden Paper Award; AACR-TOUCH Scholar-in-Training Award; GSA Presidential Membership Award',
  teaching: "Teaching, mentorship, and service: '26 VESS seminar planning committee; '25 & '26 Assistant Coach, National AI Campus @ Cedars-Sinai; '25 Co-mentor, Cedars-Sinai INSPIRE program; reviewer for SMM4H-HeaRD and BMC Cancer.",
  service: "Service: '26 VESS seminar planning committee; '26 Reviewer, SMM4H-HeaRD 2026 Workshop and Shared Tasks; '25 Reviewer, BMC Cancer.",
  'teaching/service': "Teaching, mentorship, and service: '26 VESS seminar planning committee; '25 & '26 Assistant Coach, National AI Campus @ Cedars-Sinai; '26 SMM4H-HeaRD reviewer; '25 Co-mentor, Cedars-Sinai INSPIRE program; '25 Reviewer, BMC Cancer.",
  contact: 'email: ywen.hsiao@gmail.com',
};

function wait(ms) {
  return new Promise((resolve) => {
    timer = setTimeout(resolve, ms);
  });
}

function stopDemo() {
  runningDemo = false;
  if (timer) clearTimeout(timer);
}

function liveLine() {
  return output.querySelector('.live-line');
}

function addLine(html, className = 'line') {
  const p = document.createElement('p');
  p.className = className;
  p.innerHTML = html;
  output.insertBefore(p, liveLine());
  output.scrollTop = output.scrollHeight;
}

function setCurrent(value) {
  current = value;
  live.textContent = value;
}

function clearTerminal() {
  output.querySelectorAll('.line:not(.live-line), .space').forEach((node) => node.remove());
  setCurrent('');
}

function runCommand(command, fromDemo = false) {
  if (!fromDemo) stopDemo();
  const normalized = command.trim().toLowerCase();
  if (!normalized) return;
  if (normalized === 'clear') {
    clearTerminal();
    return;
  }
  addLine(`<span class="prompt">yiwen@portfolio:~$</span> ${normalized}`);
  addLine(responses[normalized] || `unknown command: ${normalized}. try help.`);
  setCurrent('');
}

async function typeCommand(command) {
  setCurrent('');
  for (const char of command) {
    if (!runningDemo) return false;
    setCurrent(current + char);
    await wait(38 + Math.random() * 46);
  }
  await wait(280);
  return runningDemo;
}

async function runDemo() {
  stopDemo();
  clearTerminal();
  runningDemo = true;
  await wait(420);
  if (await typeCommand('about')) runCommand('about', true);
  await wait(440);
  if (await typeCommand('news')) runCommand('news', true);
  await wait(440);
  if (runningDemo) {
    addLine('- ready. type `help`, or click a command -', 'line ready');
    addLine('', 'space');
  }
  setCurrent('');
  runningDemo = false;
}

output.addEventListener('click', () => output.focus());

output.addEventListener('keydown', (event) => {
  stopDemo();
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    runCommand(current);
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    setCurrent(current.slice(0, -1));
  } else if (event.key === 'Escape') {
    setCurrent('');
  } else if (event.key.length === 1) {
    event.preventDefault();
    setCurrent(current + event.key);
  }
});

document.querySelectorAll('[data-chip]').forEach((button) => {
  button.addEventListener('click', () => {
    runCommand(button.dataset.chip);
    output.focus();
  });
});

demoButton.addEventListener('click', () => {
  runDemo();
  output.focus();
});

terminal.addEventListener('click', (event) => {
  if (!event.target.closest('button')) output.focus();
});

window.addEventListener('load', runDemo);
