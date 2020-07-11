import readHeader from './readHeader.js';
import parseIFD from './parseIFD.js';
import Image from './image.js';

export default function parseTiff(byteArray, options) {
    if (byteArray === undefined)
        throw 'tiffParser.parseTiff: missing required parameter \'byteArray\'';

    var foundBitMapValue = false;
    var byteStream = readHeader(byteArray, options);
    var numDirectories = byteStream.readUint16();
    
    var imageDescriptor = {};
    for (var i = 0; i < numDirectories; i++) {
        let IFD = parseIFD(byteStream.readByteStream(12));
        imageDescriptor[IFD['tag']] = IFD;
    }
    
    return new Image(byteStream, imageDescriptor);
}