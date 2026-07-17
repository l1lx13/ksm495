document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.more__projects-item').forEach(card => {
        const images = card.querySelectorAll('.slider-img');
        const dots = card.querySelectorAll('.more__projects-dot');
        const prevBtn = card.querySelector('.btn--prev, .btn--more.btn--prev');
        const nextBtn = card.querySelector('.btn--next, .btn--more.btn--next');
        
        if (images.length === 0) return;
        
        let currentIndex = 0;
        let isAnimating = false;
        
        const updateSlider = (direction = 'next') => {
            if (isAnimating) return;
            isAnimating = true;
            
            images[currentIndex].classList.remove('active');
            
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            
            images[currentIndex].classList.add('active');
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
            
            setTimeout(() => { isAnimating = false; }, 500);
        };
        
        if (prevBtn) prevBtn.addEventListener('click', () => updateSlider('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => updateSlider('next'));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index === currentIndex || isAnimating) return;
                currentIndex = index;
                images.forEach((img, i) => img.classList.toggle('active', i === currentIndex));
                dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
                setTimeout(() => { isAnimating = false; }, 500);
            });
        });
    });
    function initTrackSlider(wrapper, trackSelector, itemSelector, prevBtnSelector, nextBtnSelector) {
        const track = wrapper.querySelector(trackSelector);
        const items = track ? Array.from(track.querySelectorAll(itemSelector)) : [];
        const prevBtn = wrapper.querySelector(prevBtnSelector) || document.querySelector(prevBtnSelector);
        const nextBtn = wrapper.querySelector(nextBtnSelector) || document.querySelector(nextBtnSelector);
        
        if (!track || items.length === 0) return;
        
        let currentIndex = 0;
        let isAnimating = false;
        
        const getVisibleCount = () => {
            const width = window.innerWidth;
            if (width <= 768) return 1;
            if (width <= 1024) return 2;
            return 3;
        };
        
        const getMaxIndex = () => Math.max(0, items.length - getVisibleCount());
        
        const updateSlider = () => {
            if (!items[0]) return;
            
            const itemWidth = items[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 24;
            const offset = currentIndex * (itemWidth + gap);
            
            track.style.transform = `translateX(-${offset}px)`;
            
            const maxIndex = getMaxIndex();
            if (prevBtn) prevBtn.disabled = (currentIndex === 0);
            if (nextBtn) nextBtn.disabled = (currentIndex >= maxIndex);
        };
        
        const handleTransitionEnd = () => {
            isAnimating = false;
            track.removeEventListener('transitionend', handleTransitionEnd);
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (isAnimating || currentIndex === 0) return;
                isAnimating = true;
                currentIndex--;
                updateSlider();
                track.addEventListener('transitionend', handleTransitionEnd, { once: true });
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (isAnimating || currentIndex >= getMaxIndex()) return;
                isAnimating = true;
                currentIndex++;
                updateSlider();
                track.addEventListener('transitionend', handleTransitionEnd, { once: true });
            });
        }
        
        window.addEventListener('resize', () => {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            track.style.transition = 'none';
            updateSlider();
            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.5s ease-in-out';
            });
        });
        
        updateSlider();
    }
    document.querySelectorAll('.product-slider-wrapper').forEach(wrapper => {
        initTrackSlider(
            wrapper, 
            '.product-slider-track', 
            '.product__grid-item', 
            '.btn--prev', 
            '.btn--next'
        );
    });
    document.querySelectorAll('.more__projects').forEach(section => {
        const wrapper = section.querySelector('.projects-slider-wrapper');
        if (!wrapper) return;
        
        initTrackSlider(
            section,
            '.projects-slider-track', 
            '.more__projects-item', 
            '.more__project-nav .btn--prev', 
            '.more__project-nav .btn--next'
        );
    });

});