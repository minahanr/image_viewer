import CSImage from "../utils/CSImage.js";

export default function highlightContainer(element) {
    const metadata = document.getElementById('metadata-viewer');
    metadata.innerHTML = '';

    const layersContainer = document.getElementById('layers-container');
    const CSimage = CSImage.instances.get(element);
    const viewport = cornerstone.getViewport(CSimage.element);
    layersContainer.innerHTML = '';

    CSimage.layers.forEach(layer => {
        metadata.innerHTML += '=================<br>';
        metadata.innerHTML += layer.name + '<br>';
        metadata.innerHTML += '=================<br>';
        metadata.innerHTML += layer.metadata;

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
        cornerstone.loadAndCacheImage(CSimage.projection + fileFormats[layer.format] + layer.stack[CSimage.currentTimeIndex].imageIds[CSimage.currentImageIdIndex - layer.startingIndex]).then(image => {
            cornerstone.getEnabledElement(thumbnail).layers = [];
            cornerstone.addLayer(thumbnail, image, {});
            cornerstone.updateImage(thumbnail);

            
        });

        if (viewport !== undefined) {
            cornerstone.setViewport(thumbnail, viewport);
        }
    });
    

}