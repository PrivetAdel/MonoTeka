function cardSlider() {

  let offset = 0;
  const prev = document.querySelector('.pro__prev');
  const next = document.querySelector('.pro__next');

  const wrapper = document.querySelector('.cards');
  const wrapperWidth = window.getComputedStyle(wrapper).width.replace(/[a-z]+/g, '');

  const slidesField = document.querySelector('.cards__list');
  const slides = document.querySelectorAll('.cards__item');

  let slideWidth;

  switch (true) {
    case (wrapperWidth >= 728 && wrapperWidth < 1160):
      slideWidth = +wrapperWidth / 3;
      break;
    case (wrapperWidth >= 1160):
      slideWidth = +wrapperWidth / 4;
      break;
    default:
      slideWidth = +wrapperWidth;
  }
  
  slides.forEach((slide) => {
    slide.style.width = `${slideWidth}px`;
  })

  const slidesFieldWidth = slideWidth * slides.length;

  next.addEventListener('click', () => {
    if (offset >= (slidesFieldWidth - wrapperWidth)) {
      offset = 0;
    } else {
      offset += +slideWidth; 
    }

    slidesField.style.transform = `translateX(-${offset}px)`;
  });

  prev.addEventListener('click', () => {
    if (offset <= 0) {
      offset = (slidesFieldWidth - wrapperWidth);
    } else {
      offset -= +slideWidth;
    }

    slidesField.style.transform = `translateX(-${offset}px)`;
  });
}

cardSlider();
window.addEventListener('resize', cardSlider);

