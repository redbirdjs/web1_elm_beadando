function _scrollTo(selectors) {
  const element = document.querySelector(selectors);
  const position = element.getBoundingClientRect();
  window.scrollTo({ top: position.top + window.scrollY, behavior: 'smooth' });
}

const boxes = document.querySelectorAll(".box");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = " box-animation var(--box-animation-duration) ease";
      entry.target.style.opacity = 1;
    }
  })
}, {
  rootMargin: "0px 0px -100px 0px", // 👈 EZ A LÉNYEG
  threshold: 0
})

boxes.forEach(box => {
  box.style.opacity = 0
  observer.observe(box)
});