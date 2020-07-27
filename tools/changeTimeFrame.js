import CSImage from "../utils/CSImage.js";
import updateTheImage from "../utils/updateImageSelector.js";
import Synchronizer from "./Synchronizer.js";

export default function changeTimeFrame(evt) {
    let CSimage = CSImage.instances.get(evt.target.parentElement.parentElement);
    let synchronizer = Synchronizer.instances.get(CSimage);
    let currentTimeIndex = parseInt(evt.target.value, 10);

    if (synchronizer === undefined) {
        let oldImageIdIndex = CSimage.stack[CSimage.currentTimeIndex].currentImageIdIndex;
        CSimage.currentTimeIndex = currentTimeIndex;
        updateTheImage(CSimage.element, oldImageIdIndex, true);
    } else {
        synchronizer.images.forEach(newCSimage => {
            let oldImageIdIndex = newCSimage.stack[newCSimage.currentTimeIndex].currentImageIdIndex;
            newCSimage.currentTimeIndex = currentTimeIndex;
            newCSimage.element.getElementsByClassName('timeSlider')[0].value = evt.target.value;
            updateTheImage(newCSimage.element, oldImageIdIndex, true);
        });
    }
    

}