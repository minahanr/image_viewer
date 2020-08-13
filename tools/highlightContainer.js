import CSImage from "../utils/CSImage.js";
import highlightLayer from './highlightLayer.js';
import defineVariables from "../utils/defineVariables.js";

export default function highlightContainer(element) {
    if (!element.classList.contains('image')) {
        return;
    }

    CSImage.highlightedElement(element);
    CSImage.highlightedContainer(element.parentElement);
    const metadata = document.getElementById('metadata-viewer');
    metadata.innerHTML = '';

    const layersContainer = document.getElementById('layers-container');
    const CSimage = CSImage.instances().get(element);
    const viewport = cornerstone.getViewport(CSimage.element);
    layersContainer.innerHTML = '';

    CSimage.layers.forEach((layer, index) => {
        metadata.innerHTML += '=================<br>';
        metadata.innerHTML += layer.name + '<br>';
        metadata.innerHTML += '=================<br>';
        metadata.innerHTML += layer.options.dataset.metadata + '<br>';

        const layerDiv = document.createElement('div');
        layerDiv.id = 'layerDiv_#' + layer.id;
        const thumbnail = document.createElement('div');
        const layerName = document.createElement('div');
        const visible = document.createElement('div');

        layerDiv.classList = 'layer-div';
        thumbnail.classList = 'thumbnail-div';
        layerName.classList = 'layer-name-div';
        visible.classList = 'visible-layer';

        layersContainer.appendChild(layerDiv);
        layerDiv.appendChild(thumbnail);
        layerDiv.appendChild(layerName);
        layerDiv.appendChild(visible);

        layerName.innerHTML = '<span>' + layer.name + ' </span>';

        cornerstone.enable(thumbnail);
        cornerstone.loadAndCacheImage(CSimage.projection + defineVariables().fileFormats[layer.format] + layer.stack[CSimage.currentTimeIndex - layer.startingTimeIndex].imageIds[CSimage.currentImageIdIndex - layer.startingSpaceIndex]).then(image => {
            cornerstone.getEnabledElement(thumbnail).layers = [];
            cornerstone.addLayer(thumbnail, image, layer.options);
            cornerstone.updateImage(thumbnail);
        });

        if (viewport !== undefined) {
            cornerstone.setViewport(thumbnail, viewport);
        }

        layerDiv.addEventListener('click', evt => highlightLayer(evt.target));

        if (index === 0) {
            highlightLayer(layerDiv);
        }
    });
    

}