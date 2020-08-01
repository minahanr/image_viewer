import CSImage from "../utils/CSImage.js";

export default function highlightLayer (layer) {
    if (!layer.classList.contains('layer-div')) {
        return highlightLayer(layer.parentElement);
    }

    layer.parentElement.children.forEach(childLayer => {
        if (childLayer === layer) {
            layer.classList.toggle('highlighted');
        } else {
            layer.classList.remove('highlighted');
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
    console.log(CSImage.highlightedLayer());
}