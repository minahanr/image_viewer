import CSImage from "../utils/CSImage.js";
import updateTheImage from "../utils/updateImageSelector.js";
import Synchronizer from "./Synchronizer.js";

export default function changeTimeFrame(evt) {
    let CSimage = CSImage.instances().get(evt.target.parentElement.parentElement);
    let synchronizer = Synchronizer.instances().get(CSimage);
    let currentTimeIndex = parseInt(evt.target.value, 10);

    if (synchronizer === undefined) {
        CSimage.currentTimeIndex = currentTimeIndex;
        updateTheImage(CSimage.element, CSimage.currentImageIdIndex);
    } else {
        synchronizer.images.forEach(newCSimage => {
            newCSimage.currentTimeIndex = currentTimeIndex;
            newCSimage.element.getElementsByClassName('timeSlider')[0].value = evt.target.value;
            updateTheImage(newCSimage.element, oldImageIdIndex);
        });
    }
    

}