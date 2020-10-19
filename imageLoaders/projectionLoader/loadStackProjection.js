import CSImage from "../../utils/CSImage.js";
import updateTheImage from "../../utils/updateImageSelector.js";
import { splitImageVertical } from "../../tools/modifyImageWindows.js";
import Synchronizer from "../../tools/Synchronizer.js";
import defineVariables from "../../utils/defineVariables.js";


function deepCopy(object) {
    if (typeof object !== "object" || object === null) {
        return object;
    }

    let copy = Object.create(Object.getPrototypeOf(object));

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
// export default function loadStackProjection (e) {
    
//     let containers = splitImageVertical(e.target.parentElement.parentElement.parentElement, 3);
//     let baseImage = CSImage.instances().get(containers[0].getElementsByClassName('image')[0]);
//     let CSimages = [baseImage];

//     for (let i = 1; i < 3; i++) {
//         let image = document.createElement('div');
//         image.classList = 'image delete';
//         containers[i].appendChild(image);
//         let element = containers[i].getElementsByClassName('image')[0];
//         let CSimage = new CSImage.CSImage(image);
//         CSimage.layers = [];
//         CSimage.projection = 'LCI' + i + ':';
//         CSimage.lastSpaceIndex = 0;

//         baseImage.layers.forEach((layer, layerIndex) => {
//             CSimage.addLayer(layer.format, layer.stack, layer.options);
//             CSimage.layers[layerIndex].baseStack = deepCopy(CSimage.layers[layerIndex].stack);
//             CSimage.layers[layerIndex].stack = [];

//             let promises = [];
//             for(let timeIndex = 0; timeIndex < Object.keys(CSimage.layers[layerIndex].baseStack).length; timeIndex++) {
//                 promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[CSimage.layers[layerIndex].format] + CSimage.layers[layerIndex].baseStack[timeIndex].imageIds[0]));
//             }

//             Promise.all(promises).then(images => {
//                 CSimage.lastIndex = 0;
//                 for (let timeIndex = 0; timeIndex < images.length; timeIndex++) {
//                     let image = images[timeIndex];
    
//                     if (i === 1) {
//                         var numImages = image.rows;
//                     } else {
//                         var numImages = image.columns;
//                     }
                    
//                     if (numImages > CSimage.lastIndex) {
//                         CSimage.lastSpaceIndex = Math.max(CSimage.lastSpaceIndex, numImages - 1);
//                     }

//                     CSimage.layers[layerIndex].stack.push(
//                         {
//                             imageIds: [],
//                             currentImageIdIndex: 0
//                         }
//                     );
    
//                     for(let j = 0; j < numImages; j++) {
//                         CSimage.layers[layerIndex].stack[timeIndex].imageIds.push(layerIndex + ':' + timeIndex + ':' + j + ':' + element.id);
//                     }
                    
//                 }
//                 updateTheImage(element, 0);
//             });
//         });
//         CSimages.push(CSimage);
//     }
//     new Synchronizer.Synchronizer(CSimages);
// }

export default function loadStackProjection(e) {
    let containers = splitImageVertical(e.target.parentElement.parentElement.parentElement, 3);
    let baseImage = CSImage.instances().get(containers[0].getElementsByClassName('image')[0]);
    let CSimages = [baseImage];

    for (let i = 1; i < 3; i++) {
        let image = document.createElement('div');
        image.classList = 'image delete';
        containers[i].appendChild(image);
        let element = containers[i].getElementsByClassName('image')[0];
        let CSimage = new CSImage.CSImage(image);
        CSimage.layers = [];
 
        if (i === 1) {
            CSimage.projection = 'LCI';
        } else {
            CSimage.projection = 'LSI';
        }
        
        baseImage.layers.forEach((layer, layerIndex) => {
            CSimage.addLayer(layer.format, layer.stack, layer.options);

            let promises = [];
            for(let timeIndex = 0; timeIndex < Object.keys(CSimage.layers[layerIndex].stack).length; timeIndex++) {
                promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[layer.format] + ':' + layer.stack[timeIndex].imageIds[baseImage.currentImageIdIndex]));
            }

            var numImages = 0;
            Promise.all(promises).then(images => {
                for (let j = 0; j < images.length; j++) {
                    if (i === 1) {
                        numImages = max(numImages, images[j].rows);
                    } else {
                        numImages = max(numImages, images[j].cols);
                    }
                }
                CSimage.lastSpaceIndex = numImages;
            }).then((images, numImages) => {
                for (let j = 0; j < images.length; j++) {

                    let projectionIndex = CSimage.layers[layerIndex].stack[j].imageIds[0].lastIndexOf('frontal');
                    if (projectionIndex === -1) {
                        projectionIndex = CSimage.layers[layerIndex].stack[j].imageIds[0].lastIndexOf('coaxial')
                    }
                    if (projectionIndex === -1) {
                        projectionIndex = CSimage.layers[layerIndex].stack[j].imageIds[0].lastIndexOf('sagital');
                    }

                    for (let k = 0; k < numImages; k++) {
                        if (i === 1) {
                            CSimage.layers[layerIndex].stack[j].imageIds[k] = baseImage.layers[layerIndex].stack[j].imageIds[k].slice(0, projectionIndex) + 'coaxial' + baseImage.layers[layerIndex].stack[j].imageIds[k].slice(projectionIndex + 7);
                        } else {
                            CSimage.layers[layerIndex].stack[j].imageIds[k] = baseImage.layers[layerIndex].stack[j].imageIds[k].slice(0, projectionIndex) + 'sagital' + baseImage.layers[layerIndex].stack[j].imageIds[k].slice(projectionIndex + 7);
                        }
                        console.log(CSimage.layers[layerIndex].stack[j].imageIds[k]);
                    }
                }
                updateTheImage(element, 0);
            });
        });
    };
    new Synchronizer.Synchronizer(CSimages);
}