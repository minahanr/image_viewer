import CSImage from "../../utils/CSImage.js";
import updateTheImage from "../../utils/updateImageSelector.js";
import { splitImageVertical } from "../../tools/modifyImageWindows.js";
import Synchronizer from "../../tools/Synchronizer.js";

function deepCopy(object) {
    let copy;

    if (typeof object !== "object" || object === null) {
        return object;
    }

    if (Array.isArray(object)) {
        copy = [];
    } else {
        copy = {};
    }

    for (let key in object) {
        let value = object[key];

        copy[key] = deepCopy(value);
    }

    return copy;
}
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
        let CSimage = new CSImage(image, baseImage.layers[0].stack, baseImage.format);
        CSimage.layers = deepCopy(baseImage.layers);
        CSimage.dataset = baseImage.dataset;
        CSimage.projection = 'LCI' + i + ':';

        CSimage.layers.forEach((layer, layerIndex) => {
            layer.baseStack = Object.assign({}, layer.stack);
            layer.stack = [];

            let promises = [];
            for(let timeIndex = 0; timeIndex < Object.keys(layer.baseStack).length; timeIndex++) {
                promises.push(cornerstone.loadAndCacheImage(fileFormats[layer.format] + layer.baseStack[timeIndex].imageIds[0]));
            }

            Promise.all(promises).then(images => {
                CSimage.lastIndex = 0;
                for (let timeIndex = 0; timeIndex < images.length; timeIndex++) {
                    let image = images[timeIndex];
    
                    if (i === 1) {
                        var numImages = image.rows;
                    } else {
                        var numImages = image.columns;
                    }
                    
                    if (numImages > CSimage.lastIndex) {
                        CSimage.lastIndex = numImages - 1;
                    }

                    layer.stack.push(
                        {
                            imageIds: [],
                            currentImageIdIndex: 0
                        }
                    );
    
                    for(let j = 0; j < numImages; j++) {
                        layer.stack[timeIndex].imageIds.push(layerIndex + ':' + timeIndex + ':' + j + ':' + element.id);
                    }
    
                    updateTheImage(element, 0);
                }
            });
        });



        
        
        

        CSimages.push(CSimage);
    }
    
    new Synchronizer(CSimages);
}