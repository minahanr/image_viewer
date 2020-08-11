import parseTiff from '../parsers/tiffParser/parseTiff.js';
import unpack from './unpack/unpack.js';

export default function loadTiff(image_id) {
    let urlInfo = image_id.substring(image_id.indexOf(':') + 1);

    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    let promiseImage = new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {      
            if (request.readyState !== 4) {
                return;
            }

            if (request.status >= 200 && request.status < 300) {
                
                let imageDescriptor = parseTiff(new Uint8Array(request.response));
                let image = {
                    imageId: image_id, //check
                    minPixelValue: undefined, //check
                    maxPixelValue: undefined, //check
                    slope: 1.0, //check
                    intercept: 0, //check
                    windowCenter: undefined, //check
                    windowWidth: undefined, //check
                    getPixelData: undefined,
                    getCanvas: document.createElement('canvas'), //check
                    rows: imageDescriptor.elements[257][0], //check
                    columns: imageDescriptor.elements[256][0], //check
                    height: imageDescriptor.elements[257][0], //check
                    width: imageDescriptor.elements[256][0], //check
                    color: imageDescriptor.elements[262][0] !== 0 && imageDescriptor.elements[262][0] !== 1, //check
                    rgba: imageDescriptor[277] === 4, //check
                    columnPixelSpacing: imageDescriptor.elements[282][0], //check
                    rowPixelSpacing: imageDescriptor.elements[283][0], //check
                    invert: imageDescriptor.elements[262][0] === 0, //check
                    sizeInBytes: imageDescriptor.elements[257][0] * imageDescriptor.elements[256][0] * imageDescriptor.elements[277][0] * imageDescriptor.elements[258][0] / 8, //check
                };

                let maxPossibleSampleValue;
                let pixelData = new ArrayBuffer(image.sizeInBytes);
                pixelData = new Uint8Array(pixelData);
                
                if (imageDescriptor.elements[258] === 4) {
                    maxPossibleSampleValue = 15;
                    image.windowCenter = 8;
                    image.windowWidth = 15;            
                } else {
                    maxPossibleSampleValue = 255;
                    image.windowCenter = 128;
                    image.windowWidth = 255;
                }

                for (let stripIndex = 0; stripIndex < imageDescriptor.elements[273].length; stripIndex++) {
                    let samplesPerRow = imageDescriptor.elements[256][0] * imageDescriptor.elements[277][0];
                    pixelData.set(unpack(request.response, imageDescriptor, stripIndex), stripIndex * imageDescriptor.elements[278][0] * samplesPerRow)
                }

                image.getPixelData = () => pixelData
                let minMax = pixelData.reduce((accumulator, component) => [Math.min(component, accumulator[0]), Math.max(component, accumulator[1])], [maxPossibleSampleValue, 0]);
                image.minPixelValue = minMax[0];
                image.maxPixelValue = minMax[1];

                console.log(image.getPixelData());
                console.log(image);
                resolve(image);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.open('GET', urlInfo, true);
        request.send();
    });

    return {
        promise: promiseImage,
        cancelFn: undefined
    }
}