import huffmanCompression from "./huffmanDecoding.js";

function noCompression(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow) {
    return new Uint8Array(dataView, imageDescriptor.elements[273][stripIndex], numRows * samplesPerRow);
}

function packBits(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow) {
    const bytesInCompressedStrip = imageDescriptor.elements[279][stripIndex];
    let signedView = new Int8Array(dataView, imageDescriptor.elements[273][stripIndex], bytesInCompressedStrip);
    let readIndex = 0;
    let writeIndex = 0;
    let stripPixelData = new Uint8Array(new ArrayBuffer(numRows * samplesPerRow));

    while (readIndex < bytesInCompressedStrip) {
        let header = signedView[readIndex++];
        if (header >= 0) {
            stripPixelData.set(new Uint8Array(signedView.buffer, imageDescriptor.elements[273][stripIndex] + readIndex, header + 1), writeIndex);
            writeIndex += (header + 1);
            readIndex += (header + 1);
        } else if (header > -128) {
            stripPixelData.fill(signedView[readIndex], writeIndex, writeIndex + (1 - header));
            writeIndex += (1 - header);
            readIndex++;
        }
    }
    return stripPixelData;
}

export default function unpack(dataView, imageDescriptor, stripIndex) {
    const compressionSyntax = imageDescriptor.elements[259][0];
    let numRows = Math.min(imageDescriptor.elements[278][0], imageDescriptor.elements[257][0] - stripIndex * imageDescriptor.elements[278][0]);
    let samplesPerRow = imageDescriptor.elements[256][0] * imageDescriptor.elements[277][0];
    
    //huffmanDecoding();
    if (compressionSyntax === 1) {
        return noCompression(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow);
    } else if (compressionSyntax === 2) {
        return huffmanCompression(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow);
    } else if (compressionSyntax === 32773) {
        return packBits(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow);
    }
}