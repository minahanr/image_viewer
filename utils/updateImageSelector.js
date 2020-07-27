import CSImage from './CSImage.js';

function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex + 1) + '/' + CSimage.stack[CSimage.currentTimeIndex].imageIds.length;
}

export default function updateTheImage(element, imageIndex, sync) {

    let CSimage = CSImage.instances.get(element);
    CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex = imageIndex;
    updateImageSelector(CSimage);

    console.log(CSimage.projection + fileFormats[CSimage.format] + CSimage.stack[CSimage.currentTimeIndex].imageIds[CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex]);
    return cornerstone.loadAndCacheImage(CSimage.projection + fileFormats[CSimage.format] + CSimage.stack[CSimage.currentTimeIndex].imageIds[CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex]).then(image => {
        if (sync) {
            cornerstone.renderToCanvas(element.getElementsByClassName('cornerstone-canvas')[0], image, cornerstone.getViewport(element));
        } else {
            cornerstone.displayImage(element, image, cornerstone.getViewport(element));
        }

        cornerstoneTools.addStackStateManager(element, ['stack'])
        cornerstoneTools.addToolState(element, 'stack', CSimage.stack[CSimage.currentTimeIndex]);

        return image;
    });
}

