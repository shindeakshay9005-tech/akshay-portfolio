function sendMail(e) {
  e.preventDefault();
  const f = e.target;
  const body = `Name: ${f.elements.name.value}\nEmail: ${f.elements.email.value}\n\n${f.elements.message.value}`;
  window.location.href = `mailto:shindeakshay9005@gmail.com?subject=${encodeURIComponent(f.elements.subject.value)}&body=${encodeURIComponent(body)}`;
  return false;
}
