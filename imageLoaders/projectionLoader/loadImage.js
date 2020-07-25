import CSImage from '../../utils/CSImage.js';
import getMinMax from '../../internal/getMinMax.js';
import generateLut from '../../internal/generateLut.js';
import generateColorLut from '../../internal/generateColorLut.js';
import getModalityLut from '../../internal/getModalityLut.js';
import getVOILut from '../../internal/getVOILut.js' 

function requestSliceThickness(URL) {
    let promise =  fetch(URL).then(response => response.arrayBuffer()).then((buffer) => {
        let Uint8View = new Uint8Array(buffer);
        let dataset = dicomParser.parseDicom(Uint8View);
        return dataset.string('x00180050')
    });

    return promise;
}

export function loadCoaxialImage_1(imageId) {
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
            rowPixelSpacing: CSimage.dataset.string('x00180050'),
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
        for(let i = 0; i < newImage.rows; i++) {
            newImage.data.set(new Uint16Array(images[i].getPixelData().buffer, frame * newImage.columns * 2, newImage.columns), i * newImage.columns)
        }
        newImage.getPixelData = () => newImage.data;
        newImage.sizeInBytes = newImage.getPixelData().byteLength;
        let { min, max } = getMinMax(newImage.getPixelData());
        newImage.minPixelValue = min;
        newImage.maxPixelValue = max;
        return newImage;
    });
    // }).then(() => requestSliceThickness(CSimage.baseStack.imageIds[0])).then(sliceThickness => {
    //     newImage.rowPixelSpacing = sliceThickness;
    //     return newImage;
    // })
    

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

export function loadCoaxialImage_2(imageId) {
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
            columns: baseImage.rows,
            height: CSimage.baseStack.imageIds.length,
            width: baseImage.rows,
            color: baseImage.color,
            lut: baseImage.lut, 
            rgba: baseImage.rgba,
            columnPixelSpacing: baseImage.columnPixelSpacing,
            rowPixelSpacing: CSimage.dataset.string('x00180050'),
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
        for(let i = 0; i < newImage.rows; i++) {
            for (let j = 0; j < newImage.columns; j++) {
                newImage.data[i * newImage.columns + j] = images[i].getPixelData()[j * images[i].columns + frame];
            }
        }
        newImage.getPixelData = () => newImage.data;
        newImage.sizeInBytes = newImage.getPixelData().byteLength;
        let { min, max } = getMinMax(newImage.getPixelData());
        newImage.minPixelValue = min;
        newImage.maxPixelValue = max;
        return newImage;
    });
    // }).then(() => requestSliceThickness(CSimage.baseStack.imageIds[0])).then(sliceThickness => {
    //     newImage.rowPixelSpacing = sliceThickness;
    //     return newImage;
    // })
    

    return {
        promise: promiseImage,
        cancelFn: undefined
    };
}

