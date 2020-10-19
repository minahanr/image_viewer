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
        this.elements = {};

        Object.keys(imageDescriptor).forEach(tag => {
            this.elements[tag] = getValues(byteStream, imageDescriptor[tag]);
        });
    }
}