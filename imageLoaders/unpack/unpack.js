import huffmanDecoding from "./huffmanDecoding.js";

function noCompression(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow) {
    return new Uint8Array(dataView, imageDescriptor.elements[273][stripIndex], numRows * samplesPerRow);
}

function packBits(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow) {
    const bytesInCompressedStrip = imageDescriptor.elements[279][stripIndex];
    let signedView = Int8Array(dataView.buffer);
    let readIndex = 0;
    let writeIndex = 0;
    let stripPixelData = new Uint8Array(new ArrayBuffer(numRows * samplesPerRow));

    while (readIndex < bytesInCompressedStrip) {
        if (signedView[readIndex] >= 0) {
            stripPixelData.set(new Uint8Array(dataView, imageDescriptor.elements[273][stripIndex], signedView[readIndex] + 1), writeIndex);
            writeIndex += (signedView[readIndex] + 1);
            readIndex += (signedView[readIndex] + 2);
        } else if (signedView[readIndex] > -128) {
            stripPixelData.fill(signedView[readIndex + 1], writeIndex, writeIndex + (1 - signedView[readIndex + 1]));
            readIndex += 2;
            writeIndex += (1 - signedView[readIndex + 1]);
        } else {
            readIndex += 1;
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
        return huffmanCompression
    } else if (compressionSyntax === 32773) {
        return packBits(dataView, imageDescriptor, stripIndex, numRows, samplesPerRow);
    }
}