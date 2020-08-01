import updateTheImage from "./updateImageSelector";
import CSImage from './CSImage.js';
export default function updateActiveLayer(element, options) {
    const CSimage = CSImage.instances().get(element);
    CSimage.highlightedLayer.options = Object.assign(CSimage.highlightedLayer.options, options);

    updateTheImage(element, CSimage.currentImageIdIndex);
}