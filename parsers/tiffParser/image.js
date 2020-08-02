import bigEndianByteArrayParser from "./bigEndianByteArrayParser.js";
import littleEndianByteArrayParser from "./littleEndianByteArrayParser.js"
import ByteStream from './byteStream.js';
import defineVariables from '../../utils/defineVariables.js';

function transformToRational(byteStream, numBytes) {
    byteStream.byteArrayParser = bigEndianByteArrayParser;
    var array = [];
    for (let i = 0; i < numBytes/8; i++) {
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
            break;
    }

    return valueArray;
}

export default class Image {
    constructor(byteStream, imageDescriptor) {
        console.log(imageDescriptor);
        self.byteStream = byteStream;
        self.imageWidth = getValues(byteStream, imageDescriptor[256]);
        self.imageLength = getValues(byteStream, imageDescriptor[257]);
        self.bitsPerSample = getValues(byteStream, imageDescriptor[258]);
        self.compression = getValues(byteStream, imageDescriptor[259]);
        self.photoInterp = getValues(byteStream, imageDescriptor[262]);
        self.documentName = getValues(byteStream, imageDescriptor[269]);
        self.stripOffsets = getValues(byteStream, imageDescriptor[273]);
        self.rowsPerStrip = getValues(byteStream, imageDescriptor[278]);
        self.stripByteCounts = getValues(byteStream, imageDescriptor[279]);
        self.xRes = getValues(byteStream, imageDescriptor[282]);
        self.yRes = getValues(byteStream, imageDescriptor[283]);
        self.resUnit = getValues(byteStream, imageDescriptor[296]);
        self.colorMap = getValues(byteStream, imageDescriptor[320]);
    }

    getMetadata(tag) {
        switch (tag) {
            case 'byteStream':
                return self.byteStream;
            case 'imageWidth':
                return self.imageWidth;
            case 'imageLength':
                return self.imageLength;
            case 'bitsPerSample':
                return self.bitsPerSample;
            case 'compression':
                return self.compression;
            case 'photoInterp':
                return self.photoInterp;
            case 'stripOffsets':
                return self.stripOffsets;
            case 'rowsPerStrip':
                return self.rowsPerStrip;
            case 'stripBytesCounts':
                return self.stripByteCounts;
            case 'xRes':
                return self.xRes;
            case 'yRes':
                return self.yRes;
            case 'resUnit':
                return self.resUnit;
            case 'colorMap':
                return self.colorMap;
            case 'documentName':
                return self.documentName;
            default:
                return undefined;
        }
    }
}