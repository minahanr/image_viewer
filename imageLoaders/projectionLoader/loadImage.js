import CSImage from '../../utils/CSImage.js';
import getMinMax from '../../internal/getMinMax.js';
import generateLut from '../../internal/generateLut.js';
import generateColorLut from '../../internal/generateColorLut.js';
import getModalityLut from '../../internal/getModalityLut.js';
import getVOILut from '../../internal/getVOILut.js' 

export default function loadCoaxialImage(imageId) {
    imageId = imageId.substring(imageId.indexOf(':') + 1);

    let colonIndex = imageId.indexOf(':');
    let format = imageId.substring(0, colonIndex + 1);
    imageId = imageId.substring(colonIndex + 1);
    colonIndex = imageId.indexOf(':');
    let frame = parseInt(imageId.substr(0, colonIndex), 10);
    imageId = imageId.substring(imageId.indexOf(":") + 1);
    
    let element = document.getElementById(imageId);
    let CSimage = CSImage.instances.get(element);
    let promises = [];
    let newImage = {};
    let base = undefined;

    let promiseImage = cornerstone.loadImage(format + CSimage.baseStack.imageIds[0]).then(baseImage => {
        newImage = {
            imageId: frame,
            minPixelValue: undefined,
            maxPixelValue: undefined,
            slope: baseImage.slope,
            intercept: baseImage.intercept,
            windowCenter: baseImage.windowCenter,
            windowWidth: baseImage.windowWidth,
            getPixelData: undefined,
            getCanvas: baseImage.getCanvas,
            rows: CSimage.baseStack.imageIds.length,
            columns: baseImage.columns,
            height: CSimage.baseStack.imageIds.length,
            width: baseImage.columns,
            color: baseImage.color,
            lut: baseImage.lut, 
            rgba: baseImage.rgba,
            columnPixelSpacing: baseImage.columnPixelSpacing,
            rowPixelSpacing: undefined,
            invert: baseImage.invert,
            sizeInBytes: undefined,
            falseColor: baseImage.falseColor,
            origPixelData: undefined,
            stats: undefined,
            cachedLut: undefined,
            colormap: element.colormap
        };
        newImage.data = new Uint16Array(newImage.rows * newImage.columns);
        
        for (let i = 0; i < newImage.rows; i++) {
            promises.push(cornerstone.loadImage(fileFormats[CSimage.format] + CSimage.baseStack.imageIds[i]));
        }
        return Promise.all(promises);
    }).then(images => {
        for(let i = 0; i < images.length; i++) {
            newImage.data.set(new Uint16Array(images[i].getPixelData().buffer, frame * newImage.columns, newImage.columns), i * newImage.columns)
            //newImage.data.set(images[i].getPixelData().slice(frame * newImage.columns, newImage.columns), i * newImage.columns);
        }
        newImage.getPixelData = () => newImage.data;
        newImage.sizeInBytes = newImage.getPixelData().byteLength;
        let { min, max } = getMinMax(newImage.getPixelData());
        newImage.minPixelValue = min;
        newImage.maxPixelValue = max;

        console.log(newImage);
        return newImage;
    });
    

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

