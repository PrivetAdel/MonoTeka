function slider (wrapperSelector, slidesFieldSelector, slidesSelector, prevSelector, nextSelector) {

    let offset = 0;
    const wrapper = document.querySelector(wrapperSelector);
    const wrapperWidth = window.getComputedStyle(wrapper).width.replace(/[a-z]+/g, '');

    const slidesField = document.querySelector(slidesFieldSelector);
    const slides = document.querySelectorAll(slidesSelector);

    const prev = document.querySelector(prevSelector);
    const next = document.querySelector(nextSelector);

    const slideWidth = `${wrapper.dataset.width ?  wrapperWidth  : (window.getComputedStyle(slides[0]).width.replace(/[a-z]+/g, ''))}`;

    const slidesFieldWidth = `${wrapper.dataset.width ?  (wrapperWidth * slides.length) : (window.getComputedStyle(slidesField).width.replace(/[a-z]+/g, ''))}`;

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

slider('.cards', '.cards__list', '.cards__item', '.pro__prev', '.pro__next');

slider('.slider', '.slider__list', '.slider__item', '.slider__prev', '.slider__next');

window.addEventListener('resize', function() {
    slider('.cards', '.cards__list', '.cards__item', '.pro__prev', '.pro__next');

    slider('.slider', '.slider__list', '.slider__item', '.slider__prev', '.slider__next');
});
