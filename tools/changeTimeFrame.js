import CSImage from "../utils/CSImage.js";
import updateTheImage from "../utils/updateImageSelector.js";

export default function changeTimeFrame(evt) {
    let CSimage = CSImage.instances.get(evt.target.parentElement.parentElement);
    let oldImageIdIndex = CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex;
    CSimage.currentTimeIndex = parseInt(evt.target.value, 10);
    updateTheImage(CSimage.element, oldImageIdIndex, true);
}