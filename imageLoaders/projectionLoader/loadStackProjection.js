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
        let CSimage = new CSImage(image, baseImage.stack, baseImage.format);
        CSimage.dataset = baseImage.dataset;
        CSimage.projection = 'LCI' + i + ':';
        CSimage.baseStack = Object.assign({}, CSimage.stack);
        CSimage.stack = [];

        let promises = [];


        for(let timeIndex = 0; timeIndex < Object.keys(CSimage.baseStack).length; timeIndex++) {
            promises.push(cornerstone.loadAndCacheImage(fileFormats[CSimage.format] + CSimage.baseStack[timeIndex].imageIds[0]));
        }
        
        Promise.all(promises).then(images => {
            for (let timeIndex = 0; timeIndex < images.length; timeIndex++) {
                let image = images[timeIndex];

                if (i === 1) {
                    var numImages = image.rows;
                } else {
                    var numImages = image.columns;
                }
        
                CSimage.stack.push(
                    {
                        imageIds: [],
                        currentImageIdIndex: 0
                    }
                );

                for(let j = 0; j < numImages; j++) {
                    CSimage.stack[timeIndex].imageIds.push(timeIndex + ':' + j + ':' + element.id);
                }

                updateTheImage(element, 0);
            }
        }).catch(e => console.log(e));

        CSimages.push(CSimage);
    }
    
    new Synchronizer(CSimages);
}