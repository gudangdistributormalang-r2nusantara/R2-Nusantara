// ========== Testimonial Slider ==========
export function initTestimonialSlider() {
  const slider = document.getElementById('testimonialSlider');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  if (!slider || !prevBtn || !nextBtn) return;

  let isDown = false;
  let startX, scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.scrollSnapType = 'none';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.scrollSnapType = 'x mandatory';
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.scrollSnapType = 'x mandatory';
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  const getScrollAmount = () => {
    const card = slider.querySelector('.testimonial-card-slide');
    return card ? card.offsetWidth + 24 : 350;
  };

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  let autoSlide = setInterval(() => {
    if (!isDown) {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }
  }, 4000);

  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
}