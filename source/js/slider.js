function slider () {

    let offset = 0;
    const prev = document.querySelector('.slider__prev');
    const next = document.querySelector('.slider__next');

    const wrapper = document.querySelector('.slider');
    const wrapperWidth = window.getComputedStyle(wrapper).width.replace(/[a-z]+/g, '');

    const slidesField = document.querySelector('.slider__list');
    const slides = document.querySelectorAll('.slider__item');

    slides.forEach((slide) => {
        slide.style.width = `${wrapperWidth}px`
    });

    const slidesFieldWidth = +wrapperWidth * slides.length;
    slidesField.style.width = `${slidesFieldWidth}px`;

    next.addEventListener('click', () => {
        if (offset >= (slidesFieldWidth - wrapperWidth)) {
            offset = 0;
        } else {
            offset += +wrapperWidth; 
        }

        slidesField.style.transform = `translateX(-${offset}px)`;
    });

    prev.addEventListener('click', () => {
        if (offset <= 0) {
            offset = (slidesFieldWidth - wrapperWidth);
        } else {
            offset -= +wrapperWidth;
        }
        
        slidesField.style.transform = `translateX(-${offset}px)`;
    });
}

slider();
window.addEventListener('resize', slider);