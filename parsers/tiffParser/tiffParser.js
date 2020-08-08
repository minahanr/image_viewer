import bigEndianByteArrayParser from "./bigEndianByteArrayParser.js";
import littleEndianByteArrayParser from "./littleEndianByteArrayParser.js"
import ByteStream from './byteStream.js';
import defineVariables from '../../utils/defineVariables.js';

function transformToRational(byteStream, numBytes) {
    byteStream.byteArrayParser = bigEndianByteArrayParser;
    var array = [];
    for (let i = 0; i < numBytes / 8; i++) {
        let numerator = byteStream.readUint32();
        let denominator = byteStream.readUint32();

        array.push(numerator / denominator);
    }
    return array;
}

function getValues(byteStream, IFD) {
    if (IFD === undefined) {
        return undefined;
    } else if (IFD['value'] != undefined) {
        return IFD['value'];
    }

    byteStream.setPosition(IFD['offset']);
    let numBytes = IFD['count'] * defineVariables().typeSize[IFD['type']];
    var valueArray = [];
    switch (IFD['type']) {
        case 1:
            for (let i = 0; i < numBytes; i++) {
                valueArray.push(byteStream.readUint8());
            }
            break;
        case 2:
            valueArray = byteStream.readFixedString(numBytes);
            break;
        case 3:
            for (let i = 0; i < numBytes / 2; i++) {
                valueArray.push(byteStream.readUint16());
            }
            break;
        case 4:
            for (let i = 0; i < numBytes / 4; i++) {
                valueArray.push(byteStream.readUint32());
            }
            break;
        case 5:
            valueArray = transformToRational(byteStream, numBytes);
            break;
        case 6:
            for (let i = 0; i < numBytes; i++) {
                valueArray.push(byteStream.readUint8());
            }
            break;
        case 8:
            for (let i = 0; i < numBytes / 2; i++) {
                valueArray.push(byteStream.readInt16());
            }
            break;
        case 9:
            for (let i = 0; i < numBytes / 4; i++) {
                valueArray.push(byteStream.readInt32());
            }
            break;
        case 11:
            for (let i = 0; i < numBytes / 4; i++) {
                valueArray.push(byteStream.readFloat());
            }
            break;
        case 12:
            for (let i = 0; i < numBytes / 4; i++) {
                valueArray.push(byteStream.readDouble());
            }
            break;
        default:
            console.log(IFD['tag']);
            return undefined;
    }

    IFD['value'] = valueArray;
    return valueArray;
}

export default class tiffParser {
    constructor(byteStream, imageDescriptor) {
        this.elements = [];
        // this.byteStream = byteStream;
        // this.imageWidth = getValues(byteStream, imageDescriptor[256]);
        // this.imageLength = getValues(byteStream, imageDescriptor[257]);
        // this.bitsPerSample = getValues(byteStream, imageDescriptor[258]);
        // this.compression = getValues(byteStream, imageDescriptor[259]);
        // this.photoInterp = getValues(byteStream, imageDescriptor[262]);
        // this.documentName = getValues(byteStream, imageDescriptor[269]);
        // this.stripOffsets = getValues(byteStream, imageDescriptor[273]);
        // this.rowsPerStrip = getValues(byteStream, imageDescriptor[278]);
        // this.stripByteCounts = getValues(byteStream, imageDescriptor[279]);
        // this.xRes = getValues(byteStream, imageDescriptor[282]);
        // this.yRes = getValues(byteStream, imageDescriptor[283]);
        // this.resUnit = getValues(byteStream, imageDescriptor[296]);
        // this.colorMap = getValues(byteStream, imageDescriptor[320]);
        Object.keys(imageDescriptor).forEach(tag => {
            this.elements[tag] = getValues(byteStream, imageDescriptor[tag]);
        });
    }

    getMetadata(tag) {
        switch (tag) {
            case 'byteStream':
                return this.byteStream;
            case 'imageWidth':
                return this.imageWidth;
            case 'imageLength':
                return this.imageLength;
            case 'bitsPerSample':
                return this.bitsPerSample;
            case 'compression':
                return this.compression;
            case 'photoInterp':
                return this.photoInterp;
            case 'stripOffsets':
                return this.stripOffsets;
            case 'rowsPerStrip':
                return this.rowsPerStrip;
            case 'stripBytesCounts':
                return this.stripByteCounts;
            case 'xRes':
                return this.xRes;
            case 'yRes':
                return this.yRes;
            case 'resUnit':
                return this.resUnit;
            case 'colorMap':
                return this.colorMap;
            case 'documentName':
                return this.documentName;
            default:
                return undefined;
        }
    }
}