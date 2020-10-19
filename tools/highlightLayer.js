import CSImage from "../utils/CSImage.js";

export default function highlightLayer (layer) {
    if (!layer.classList.contains('layer-div')) {
        return highlightLayer(layer.parentElement);
    }

    layer.parentElement.children.forEach(childLayer => {
        if (childLayer === layer) {
            childLayer.classList.add('highlighted');
        } else {
            console.log('not equal');
            childLayer.classList.remove('highlighted');
        }
    })

    const layerIndex = parseInt(layer.id.substring(layer.id.indexOf('#') + 1), 10);
    let highlightedLayer;

    CSImage.instances().get(CSImage.highlightedElement()).layers.forEach(tempLayer => {
        if (tempLayer.id === layerIndex) {
            highlightedLayer = tempLayer;
        }
    });

    CSImage.highlightedLayer(highlightedLayer);
    if (highlightedLayer.options.opacity === undefined) {
        document.getElementById('opacitySlider').value = '1.00';
    } else {
        document.getElementById('opacitySlider').value = highlightedLayer.options.opacity;
    }
    let CSimage = CSImage.instances().get(CSImage.highlightedElement());
    let CSlayer = cornerstone.getLayer(CSimage.element, CSImage.highlightedLayer().uid);
    if (CSImage.highlightedLayer().uid === undefined || CSlayer.viewport.colormap === undefined) {
        document.getElementById('colormaps').value = 'None';
    } else {
        document.getElementById('colormaps').value = CSlayer.viewport.colormap;
    }
    
}