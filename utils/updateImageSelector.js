import CSImage from './CSImage.js';
import defineVariables from './defineVariables.js';


function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.currentImageIdIndex + 1) + '/' + (CSimage.lastSpaceIndex + 1);
}

export default function updateTheImage(element, imageIndex, sync) {
    let CSimage = CSImage.instances().get(element);
    CSimage.currentImageIdIndex = imageIndex;
    updateImageSelector(CSimage);
    const prevViewport = cornerstone.getViewport(element);

    let promises = [];
    CSimage.layers.forEach(layer => {
        if (CSimage.currentImageIdIndex < layer.startingSpaceIndex + layer.stack[0].imageIds.length && CSimage.currentImageIdIndex >= layer.startingSpaceIndex &&
            CSimage.currentTimeIndex < layer.startingSpaceIndex + layer.stack[0].imageIds.length && CSimage.currentTimeIndex >= layer.startingTimeIndex) {
                layer.stack[CSimage.currentTimeIndex].currentImageIdIndex = imageIndex;
                console.log(defineVariables().fileFormats[layer.format] + layer.stack[CSimage.currentTimeIndex].imageIds[CSimage.currentImageIdIndex]);
                promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[layer.format] + layer.stack[CSimage.currentTimeIndex].imageIds[CSimage.currentImageIdIndex]));
        } 
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

