import CSImage from "../../utils/CSImage.js";
import updateTheImage from "../../utils/updateImageSelector.js";
import { splitImageVertical } from "../../tools/modifyImageWindows.js";
import Synchronizer from "../../tools/Synchronizer.js";

export default function loadStackProjection (e) {
    
    let containers = splitImageVertical(e.target.parentElement.parentElement.parentElement, 3);
    let baseImage = CSImage.instances.get(containers[0].getElementsByClassName('image')[0]);
    let CSimages = [baseImage];
    for (let i = 1; i < 3; i++) {
        let image = document.createElement('div');
        image.classList = 'image delete';
        containers[i].appendChild(image);
        containers[i].getElementsByClassName('addImage')[0].style.display = 'none';
        let element = containers[i].getElementsByClassName('image')[0];
        let CSimage = new CSImage(image, baseImage.stack.imageIds, baseImage.format);
        CSimage.dataset = baseImage.dataset;
        CSimage.projection = 'LCI' + i + ':';
        CSimage.baseStack = Object.assign({}, CSimage.stack);
        CSimage.stack = {
            imageIds: [],
            currentImageIdIndex: 0
        };

        cornerstone.loadAndCacheImage(fileFormats[CSimage.format] + CSimage.baseStack.imageIds[0]).then(tempImage => {
            if (i === 1) {
                CSimage.numImages = tempImage.rows;
            } else {
                CSimage.numImages = tempImage.columns;
            }

            for(let i = 0; i < CSimage.numImages; i++) {
                CSimage.stack.imageIds.push(i + ':' + element.id);
            }

            updateTheImage(element, 0);
        }).catch(e => console.log(e));

        CSimages.push(CSimage);        
    }
    
    new Synchronizer(CSimages);
}