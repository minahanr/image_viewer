import parseTiff from '../parsers/tiffParser/parseTiff.js';
import { readFixedString } from '../parsers/tiffParser/byteArrayParser.js';

export default function loadTiff(image_id) {
    let urlInfo = image_id.substring(image_id.indexOf(':') + 1);

    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onload = function() {
        console.log(request.response[0]);
        let imageDescriptor = parseTiff(new Uint8Array(request.response));
        console.log(imageDescriptor);
        image = {
            imageId: image_id, //check
            minPixelValue: undefined,
            maxPixelValue: undefined,
            slope: undefined,
            intercept: undefined,
            windowCenter: undefined,
            windowWidth: undefined,
            getPixelData: undefined,
            getCanvas: document.createElement('canvas'), //check
            rows: imageDescriptor[257], //check
            columns: imageDescriptor[256], //check
            height: imageDescriptor[257], //check
            width: imageDescriptor[256], //check
            color: imageDescriptor[262] !== 0 && imageDescriptor[262] !== 1, //check
            lut: baseImage.lut, 
            rgba: baseImage.rgba,
            columnPixelSpacing: imageDescriptor[282], //check
            rowPixelSpacing: imageDescriptor[283], //check
            invert: baseImage.invert,
            sizeInBytes: undefined,
            falseColor: baseImage.falseColor,
            origPixelData: undefined,
            stats: undefined,
            cachedLut: undefined,
            colormap: element.colormap,
            data: undefined
        }
    };

    console.log(urlInfo);
    request.open('GET', urlInfo, true);
    request.send();
}