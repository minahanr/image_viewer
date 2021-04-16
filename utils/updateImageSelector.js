import CSImage from './CSImage.js';
import defineVariables from './defineVariables.js';
import Synchronizer from '../tools/Synchronizer.js';


function updateImageSelector(CSimage) {
    CSimage.element.parentElement.getElementsByClassName('text')[0].innerHTML = (CSimage.currentImageIdIndex + 1) + '/' + (CSimage.lastSpaceIndex + 1);
}

export default function updateTheImage(element, imageIndex, sync) {
    let CSimage = CSImage.instances().get(element);

    let synchronizer = Synchronizer.instances().get(CSimage);
    let baseCSimage = undefined;
    if (synchronizer !== undefined) {
        synchronizer.images.forEach(image => {
            if (image.projection === 'frontal') {
                baseCSimage = image;
            }
        });
    } else {
        baseCSimage = CSimage;
    }

    CSimage.currentImageIdIndex = imageIndex;
    updateImageSelector(CSimage);
    const prevViewport = cornerstone.getViewport(element);

    let promises = [];
    CSimage.layers.forEach((layer, layerIndex) => {
        if (CSimage.currentImageIdIndex < layer.startingSpaceIndex + layer.stack[0].imageIds.length && CSimage.currentImageIdIndex >= layer.startingSpaceIndex &&
            CSimage.currentTimeIndex < layer.startingSpaceIndex + layer.stack[0].imageIds.length && CSimage.currentTimeIndex >= layer.startingTimeIndex) {
                layer.stack[CSimage.currentTimeIndex].currentImageIdIndex = imageIndex;
                promises.push(cornerstone.loadAndCacheImage(CSimage.projection + ':' + defineVariables().fileFormats[layer.format] + layer.baseURL + '/' + CSimage.projection + '/' + layer.stack[CSimage.currentTimeIndex].imageIds[CSimage.currentImageIdIndex], baseCSimage.layers[layerIndex]));
        } 
    });

    Promise.all(promises).then(images => {
        cornerstone.getEnabledElement(element).layers = [];
        images.forEach((image, index) => {
            CSimage.layers[index].uid = cornerstone.addLayer(element, image, CSimage.layers[index].options);
            cornerstone.getLayer(CSimage.element, CSimage.layers[index].uid).viewport.colormap = CSimage.layers[index].colormap;
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

