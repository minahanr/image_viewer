import now from './now.js';
import drawCompositeImage from './drawCompositeImage.js';
const renderColorImage = cornerstone.renderColorImage;
const renderGrayscaleImage = cornerstone.renderGrayscaleImage;
const renderPseudoColorImage = cornerstone.renderPseudoColorImage;
const renderLabelMapImage = cornerstone.renderLabelMapImage;
const triggerEvent = cornerstone.triggerEvent;
const EVENTS = cornerstone.EVENTS;
/**
 * Draw an image to a given enabled element synchronously
 *
 * @param {EnabledElement} enabledElement An enabled element to draw into
 * @param {Boolean} invalidated - true if pixel data has been invalidated and cached rendering should not be used
 * @returns {void}
 * @memberof Internal
 */
export default function (enabledElement, invalidated) {
  const image = enabledElement.image;
  const element = enabledElement.element;
  const layers = enabledElement.layers || [];

  // Check if enabledElement can be redrawn
  if (!enabledElement.canvas || !(enabledElement.image || layers.length)) {
    return;
  }

  // Start measuring the time needed to draw the image/layers
  const start = now();

  image.stats = {
    lastGetPixelDataTime: -1.0,
    lastStoredPixelDataToCanvasImageDataTime: -1.0,
    lastPutImageDataTime: -1.0,
    lastRenderTime: -1.0,
    lastLutGenerateTime: -1.0
  };

  if (layers && layers.length) {
    drawCompositeImage(enabledElement, invalidated);
  } else if (image) {
    let render = image.render;

    if (!render) {
      if (enabledElement.viewport.colormap &&
          enabledElement.viewport.colormap !== '' &&
          enabledElement.image.labelmap === true) {
        render = renderLabelMapImage;
      } else if (enabledElement.viewport.colormap && enabledElement.viewport.colormap !== '') {
        render = renderPseudoColorImage;
      } else if (image.color) {
        render = renderColorImage;
      } else {
        render = renderGrayscaleImage;
      }
    }

    render(enabledElement, invalidated);
  }

  // Calculate how long it took to draw the image/layers
  const renderTimeInMs = now() - start;

  const eventData = {
    viewport: enabledElement.viewport,
    element,
    image,
    enabledElement,
    canvasContext: enabledElement.canvas.getContext('2d'),
    renderTimeInMs
  };

  image.stats.lastRenderTime = renderTimeInMs;

  enabledElement.invalid = false;
  enabledElement.needsRedraw = false;

  triggerEvent(element, EVENTS.IMAGE_RENDERED, eventData);
}