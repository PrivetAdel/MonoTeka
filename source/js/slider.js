function slider() {

  let offset = 0;
  let slideIndex = 1;
  const prev = document.querySelector('.slider__prev');
  const next = document.querySelector('.slider__next');

  const wrapper = document.querySelector('.slider');
  const wrapperWidth = window.getComputedStyle(wrapper).width.replace(/[a-z]+/g, '');

  const slidesField = document.querySelector('.slider__list');
  const slides = document.querySelectorAll('.slider__item');

  slides.forEach((slide) => {
    slide.style.width = `${wrapperWidth}px`;
  });

  const slidesFieldWidth = +wrapperWidth * slides.length;

  next.addEventListener('click', () => {
    if (slideIndex === slides.length) {
      offset = 0;
      slideIndex = 1;
    } else {
      offset += +wrapperWidth;
      slideIndex++;
    }

    slidesField.style.transform = `translateX(-${offset}px)`;
  });

  prev.addEventListener('click', () => {
    if (slideIndex === 1) {
      offset = (slidesFieldWidth - wrapperWidth);
      slideIndex = slides.length;
    } else {
      offset -= +wrapperWidth;
      slideIndex--;
    }

    slidesField.style.transform = `translateX(-${offset}px)`;
  });
}

slider();
window.addEventListener('resize', slider);