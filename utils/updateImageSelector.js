import CSImage from './CSImage.js';

function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.stack.currentImageIdIndex + 1) + '/' + CSimage.numImages;
}

export default function updateTheImage(element, imageIndex, sync) {

    let CSimage = CSImage.instances.get(element);
    CSimage.stack.currentImageIdIndex = imageIndex;
    updateImageSelector(CSimage);

    
    return cornerstone.loadAndCacheImage(CSimage.projection + fileFormats[CSimage.format] + CSimage.stack.imageIds[CSimage.stack.currentImageIdIndex]).then(image => {
        if (sync) {
            cornerstone.renderToCanvas(element.getElementsByClassName('cornerstone-canvas')[0], image, cornerstone.getViewport(element));
        } else {
            cornerstone.displayImage(element, image, cornerstone.getViewport(element));
        }

        cornerstoneTools.addStackStateManager(element, ['stack'])
        cornerstoneTools.addToolState(element, 'stack', CSimage.stack);

        return image;
    });
}

