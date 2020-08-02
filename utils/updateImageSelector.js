import CSImage from './CSImage.js';
import defineVariables from './defineVariables.js';

function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.currentImageIdIndex + CSimage.layers[0].startingIndex + 1) + '/' + (CSimage.lastIndex + 1);
}

export default function updateTheImage(element, imageIndex, sync) {
    let CSimage = CSImage.instances().get(element);
    CSimage.currentImageIdIndex = imageIndex;
    updateImageSelector(CSimage);
    const prevViewport = cornerstone.getViewport(element);

    let promises = [];
    CSimage.layers.forEach(layer => {
        layer.stack[CSimage.currentTimeIndex].currentImageIdIndex = imageIndex;
        promises.push(cornerstone.loadAndCacheImage(CSimage.projection + defineVariables().fileFormats[layer.format] + layer.stack[CSimage.currentTimeIndex].imageIds[CSimage.currentImageIdIndex - layer.startingIndex]));
    });

    Promise.all(promises).then(images => {
        cornerstone.getEnabledElement(element).layers = [];
        images.forEach((image, index) => {
            CSimage.layers[index].uid = cornerstone.addLayer(element, image, CSimage.layers[index].options);
        });

        if (sync) {
            cornerstone.renderToCanvas(element);
        } else {
            cornerstone.updateImage(element);
        }

        if (prevViewport !== undefined) {
            cornerstone.setViewport(element, prevViewport);
        }
    });
}

