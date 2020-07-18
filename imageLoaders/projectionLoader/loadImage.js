import CSImage from '../../utils/CSImage.js';
import getMinMax from '../../internal/getMinMax.js';
import generateLut from '../../internal/generateLut.js';
import generateColorLut from '../../internal/generateColorLut.js';
import getModalityLut from '../../internal/getModalityLut.js';
import getVOILut from '../../internal/getVOILut.js' 

export default function loadCoaxialImage(imageId, element) {
    let frame = 353;
    imageId = imageId.substring(imageId.indexOf(":") + 1);
    let CSimage = CSImage.instances.get(element);
    let promises = [];
    let newImage = {};
    let base = undefined;
    let promiseImage = cornerstone.loadAndCacheImage(fileFormats[CSimage.format] + CSimage.stack.imageIds[0]).then(baseImage => {
        console.log(baseImage);
        newImage = {
            imageId: '',
            minPixelValue: undefined,
            maxPixelValue: undefined,
            slope: baseImage.slope,
            intercept: baseImage.intercept,
            windowCenter: baseImage.windowCenter,
            windowWidth: baseImage.windowWidth,
            getPixelData: undefined,
            getCanvas: baseImage.getCanvas,
            rows: CSimage.stack.imageIds.length,
            columns: baseImage.columns,
            height: CSimage.stack.imageIds.length,
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
            promises.push(cornerstone.loadAndCacheImage(fileFormats[CSimage.format] + CSimage.stack.imageIds[i]));
        }
    }).then(() => Promise.all(promises)).then(images => {
        for(let i = 0; i < images.length; i++) {
            newImage.data.set(new Uint16Array(images[i].getPixelData().buffer, frame * newImage.columns, newImage.columns), i * newImage.columns)
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

