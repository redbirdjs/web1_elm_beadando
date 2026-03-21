function _scrollTo(selectors) {
  const element = document.querySelector(selectors);
  const position = element.getBoundingClientRect();
  window.scrollTo({ top: position.top + window.scrollY, behavior: 'smooth' });
}