import ByteStream from './byteStream.js';
import littleEndianByteArrayParser from './littleEndianByteArrayParser.js';
import bigEndianByteArrayParser from './bigEndianByteArrayParser.js';
import {readFixedString } from './byteArrayParser.js';

export default function readHeader(byteArray, options) {
    if (byteArray === undefined)
        throw 'tiff.parser: missing required parameter \'byteArray\'';

    let endianness = readFixedString(byteArray, 0, 2);
    if (endianness === 'II'){
        var byteStream = new ByteStream(littleEndianByteArrayParser, byteArray, 2);
    } else if (endianness === 'MM') {
        var byteStream = new ByteStream(bigEndianByteArrayParser, byteArray, 2);
    } else {
        throw 'tiff.parser: bytes 0-1 of improper format';
    }

    if (byteStream.readUint16() != 42)
        throw 'tiff.parser: bytes 2-3 of improper format';

    byteStream.setPosition(byteStream.readUint32());
    return byteStream;
}