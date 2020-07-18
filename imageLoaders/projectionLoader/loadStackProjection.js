import CSImage from "../../utils/CSImage.js";
import updateTheImage from "../../utils/updateImageSelector.js";

export default function loadStackProjection (e) {
    let element = e.target.parentElement.parentElement;
    let CSimage = CSImage.instances.get(element);
    CSimage.projection = 'mpr:';
    CSimage.baseStack = Object.assign({}, CSimage.stack);
    CSimage.stack = {
        imageIds: [],
        currentImageIdIndex: 0
    };
    console.log(fileFormats[CSimage.format] + CSimage.baseStack.imageIds[0]);
    cornerstone.loadAndCacheImage(fileFormats[CSimage.format] + CSimage.baseStack.imageIds[0]).then(image => {
        CSimage.numImages = image.height;

        for(let i = 0; i < CSimage.numImages; i++) {
            CSimage.stack.imageIds.push(i + ':' + element.id);
        }

        updateTheImage(element, 0);
    }).catch(e => console.log(e));
}