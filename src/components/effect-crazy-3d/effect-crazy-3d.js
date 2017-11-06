import $ from '../../utils/dom';
import Browser from '../../utils/browser';
import Utils from '../../utils/utils';

const Crazy3d = {
  setTranslate() {
    const swiper = this;
    const { width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid } = swiper;
    const params = swiper.params.crazy3dEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + (swiperWidth / 2) : -transform + (swiperHeight / 2);
    const translate = params.depth;
    // Each slide offset from center
    for (let i = 0, length = slides.length; i < length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideSize = slidesSizesGrid[i];
      const slideOffset = $slideEl[0].swiperSlideOffset;
      let offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

      offsetMultiplier += Math.abs(offsetMultiplier) * params.asymmetry;

      const mainOffset = params.stretch * offsetMultiplier;
      const secondaryOffset = -offsetMultiplier * params.secondaryOffsetModifier;

      let translateZ = -translate * Math.abs(offsetMultiplier);
      let translateY = isHorizontal ? secondaryOffset : mainOffset;
      let translateX = isHorizontal ? mainOffset : secondaryOffset;

      let opacity = !offsetMultiplier ? 1 : 1 / Math.abs(offsetMultiplier * (1 / params.opacityModifier));
      // Fix for ultra small values

      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(opacity) < 0.001) opacity = 0;

      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)`;

      $slideEl.transform(slideTransform);
      $slideEl.css({ opacity: opacity });
      $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
    }

    // Set correct perspective for IE10
    if (Browser.ie) {
      const ws = $wrapperEl[0].style;
      ws.perspectiveOrigin = `${center}px 50%`;
    }
  },
  setTransition(duration) {
    const swiper = this;
    swiper.slides
      .transition(duration)
  },
};

export default {
  name: 'effect-crazy-3d',
  params: {
    crazy3dEffect: {
      stretch: 0,
      depth: 100,
      modifier: 6,
      opacityModifier: 2,
      secondaryOffsetModifier: 7,
      asymmetry: 0,
    },
  },
  create() {
    const swiper = this;
    Utils.extend(swiper, {
      crazy3dEffect: {
        setTranslate: Crazy3d.setTranslate.bind(swiper),
        setTransition: Crazy3d.setTransition.bind(swiper),
      },
    });
  },
  on: {
    beforeInit() {
      const swiper = this;
      if (swiper.params.effect !== 'crazy3d') return;

      swiper.classNames.push(`${swiper.params.containerModifierClass}crazy-3d`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

      swiper.params.watchSlidesProgress = true;
    },
    setTranslate() {
      const swiper = this;
      if (swiper.params.effect !== 'crazy3d') return;
      swiper.crazy3dEffect.setTranslate();
    },
    setTransition(duration) {
      const swiper = this;
      if (swiper.params.effect !== 'crazy3d') return;
      swiper.crazy3dEffect.setTransition(duration);
    },
  },
};
