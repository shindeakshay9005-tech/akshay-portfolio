(() => {
  // Move the chat section just above the footer so it sits at the bottom of the page
  const askSec = document.getElementById('ask');
  const footer = document.getElementById('contact');
  if (askSec && footer) footer.parentNode.insertBefore(askSec, footer);

  const KB = [
    { k: ['who', 'about', 'introduce', 'yourself', 'background', 'summary', 'akshay'],
      a: 'Akshay Shinde is a Java Full Stack Developer based in Mumbai. He has six months of professional training as a System Associate Trainee at Infosys, plus two months of client-facing experience as a Relationship Manager at a Maruti Suzuki showroom, works with Java, Spring Boot, React.js and REST APIs, and is pursuing an MCA at Bharati Vidyapeeth, Pune.' },
    { k: ['skill', 'tech', 'stack', 'language', 'know', 'technolog', 'java', 'spring', 'react', 'database', 'sql', 'python'],
      a: 'His main skills are Java, Spring Boot, JPA, RESTful APIs, React.js, JavaScript, HTML5, CSS3, Bootstrap, MySQL, PostgreSQL, MongoDB, Python, Git, GitHub and Maven. He also works with Prompt Engineering and AI agents, and knows Data Structures and Algorithms.' },
    { k: ['project', 'built', 'build', 'portfolio', 'github', 'farmer', 'cart', 'pyquest'],
      a: 'His projects include the Farmers Web Application (his final-year BSc IT project), E-Cart, an online shopping cart in Java built with OOP, and PyQuest, a gamified Python learning platform. Code is on GitHub at github.com/shindeakshay9005-tech.' },
    { k: ['experience', 'infosys', 'trainee', 'company', 'worked', 'internship experience', 'issue', 'tracker'],
      a: 'He completed six months as a System Associate Trainee at Infosys, where he learned HTML, CSS, JavaScript and other languages, built an Issue Tracker project, worked in an Agile and Scrum team, learned Prompt Engineering and keeps upgrading to current market technologies. He also worked for two months as a Relationship Manager at a Maruti Suzuki showroom.' },
    { k: ['maruti', 'suzuki', 'showroom', 'relationship', 'manager', 'sales', 'client', 'customer', 'quotation', 'vehicle', 'car', 'non tech', 'non-tech'],
      a: 'Before and alongside tech, Akshay worked for two months as a Relationship Manager at a Maruti Suzuki showroom. He handled clients, prepared quotations, learned about motors and different types of vehicles, and understood the vehicle sales process. It built his communication and client-handling skills.' },
    { k: ['education', 'study', 'college', 'degree', 'mca', 'bsc', 'university', 'school', 'marks', 'cgpa', 'percentage', 'qualification'],
      a: 'He is pursuing an MCA at Bharati Vidyapeeth, Pune. He completed a BSc in Information Technology from Mumbai University at Pillai HOC College with a CGPA of 8.9 out of 10. His HSC result was 77.17% (2021) and his SSC was 75.40% (2019).' },
    { k: ['certif', 'course', 'achievement', 'sport', 'award'],
      a: 'His certifications cover Agile and Scrum, AI and Prompt Engineering, Java Full Stack Development and Business Intelligence. He also holds a State Sports Certificate for state-level participation.' },
    { k: ['ai', 'prompt', 'agent', 'agents', 'automation', 'chatgpt'],
      a: 'He trained in Prompt Engineering and has worked on four AI agents to automate tasks and improve development productivity.' },
    { k: ['leetcode', 'dsa', 'algorithm', 'algorithms', 'problem', 'coding'],
      a: 'He is a strong problem solver on LeetCode and practises Data Structures and Algorithms regularly.' },
    { k: ['contact', 'email', 'mail', 'phone', 'number', 'reach', 'linkedin', 'call', 'whatsapp'],
      a: 'You can reach him at shindeakshay9005@gmail.com or +91 7709143678. His LinkedIn is linkedin.com/in/akshay-shinde11. You can also use the contact form at the bottom of this page.' },
    { k: ['resume', 'cv', 'download'],
      a: 'You can download his resume using the Download Resume button at the top of the page, or the button in the contact section.' },
    { k: ['location', 'where', 'live', 'city', 'mumbai', 'pune', 'relocate'],
      a: 'He is based in Mumbai, Maharashtra, and studies for his MCA at Bharati Vidyapeeth in Pune.' },
    { k: ['available', 'availability', 'open', 'hire', 'hiring', 'job', 'jobs', 'role', 'opportunit', 'intern', 'internship', 'fresher', 'join'],
      a: 'He is open to Full Stack Developer roles and internships. Please reach out by email or through the contact form to discuss opportunities.' },
    { k: ['hi', 'hello', 'hey', 'namaste', 'hii'],
      a: 'Hello! Ask me anything about Akshay, such as his skills, projects, experience, education or how to contact him.' },
    { k: ['thanks', 'thank', 'thx', 'ok', 'great', 'nice'],
      a: 'Happy to help! If you want to know anything else about Akshay, just ask.' }
  ];
  const FALLBACK = "I do not have that information in his profile. You can ask about his skills, projects, experience, education or availability, or contact him directly at shindeakshay9005@gmail.com and he will be happy to answer.";

  const fab = document.getElementById('chatFab');
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const chips = document.getElementById('chatChips');

  // Short keywords must match whole words (so "hi" does not match "this", "ai" does not match "email")
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hit = (text, kw) => (kw.length <= 3 || kw.includes(' '))
    ? new RegExp('(^|[^a-z0-9])' + esc(kw) + '($|[^a-z0-9])').test(text)
    : text.includes(kw);

  function add(text, who) {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function answer(q) {
    const t = q.toLowerCase().replace(/[^a-z0-9+#.@\s]/g, ' ');
    let best = null, score = 0;
    KB.forEach(item => {
      const sc = item.k.reduce((n, kw) => n + (hit(t, kw) ? 1 : 0), 0);
      if (sc > score) { score = sc; best = item; }
    });
    return best ? best.a : FALLBACK;
  }
  function ask(q) {
    q = q.trim();
    if (!q) return;
    add(q, 'me');
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    setTimeout(() => { typing.remove(); add(answer(q), 'bot'); }, 650);
  }

  add('Hi! I can answer questions about Akshay Shinde. Pick a topic or type your question.', 'bot');

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; });
  chips.addEventListener('click', e => { const b = e.target.closest('button[data-q]'); if (b) ask(b.dataset.q); });

  // Floating ASK button jumps to the chat section; hides while the section is on screen
  fab.addEventListener('click', () => {
    askSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => input.focus({ preventScroll: true }), 700);
  });
  new IntersectionObserver(e => fab.classList.toggle('hide', e[0].isIntersecting), { threshold: .25 }).observe(askSec);
})();
