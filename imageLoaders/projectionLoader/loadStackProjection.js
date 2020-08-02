import CSImage from "../../utils/CSImage.js";
import updateTheImage from "../../utils/updateImageSelector.js";
import { splitImageVertical } from "../../tools/modifyImageWindows.js";
import Synchronizer from "../../tools/Synchronizer.js";
import defineVariables from "../../utils/defineVariables.js";

function deepCopy(object) {
    let copy;

    if (typeof object instanceof Function) {
        return;
    } else if (typeof object !== "object" || object === null) {
        return object;
    }

    if (Array.isArray(object)) {
        copy = [];
    } else {
        copy = {};
    }

    for (let key in object) {
        let value = object[key];
        if (Array.isArray(copy)) {
            copy.push(deepCopy(value));
        } else {
            copy[key] = deepCopy(value);
        }
    }

    return copy;
}
export default function loadStackProjection (e) {
    
    let containers = splitImageVertical(e.target.parentElement.parentElement.parentElement, 3);
    let baseImage = CSImage.instances().get(containers[0].getElementsByClassName('image')[0]);
    let CSimages = [baseImage];

    for (let i = 1; i < 3; i++) {
        let image = document.createElement('div');
        image.classList = 'image delete';
        containers[i].appendChild(image);
        containers[i].getElementsByClassName('addImage')[0].style.display = 'none';
        let element = containers[i].getElementsByClassName('image')[0];
        let CSimage = new CSImage.CSImage(image);
        CSimage.layers = [];
        CSimage.projection = 'LCI' + i + ':';
        baseImage.layers.forEach((layer, layerIndex) => {
            CSimage.addLayer(layer.format, layer.stack, 0);
            CSimage.layers[layerIndex].baseStack = deepCopy(CSimage.layers[layerIndex].stack);
            CSimage.layers[layerIndex].stack = [];

            let promises = [];
            for(let timeIndex = 0; timeIndex < Object.keys(CSimage.layers[layerIndex].baseStack).length; timeIndex++) {
                promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[CSimage.layers[layerIndex].format] + CSimage.layers[layerIndex].baseStack[timeIndex].imageIds[0]));
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

                    CSimage.layers[layerIndex].stack.push(
                        {
                            imageIds: [],
                            currentImageIdIndex: 0
                        }
                    );
    
                    for(let j = 0; j < numImages; j++) {
                        CSimage.layers[layerIndex].stack[timeIndex].imageIds.push(layerIndex + ':' + timeIndex + ':' + j + ':' + element.id);
                    }

                    updateTheImage(element, 0);
                }
            });
        });

        CSimages.push(CSimage);
    }
    
    new Synchronizer.Synchronizer(CSimages);
}