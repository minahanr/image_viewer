function readData(view, lut, bitOffset, bytesInCompressedStrip) {
    const bitIndex = bitOffset % 8;
    const byteIndex = (bitOffset - bitIndex) / 8;

    let data = [];
    data.push(view.readUint8(byteIndex++));
    if (byteIndex < bytesInCompressedStrip) {
        data.push(view.readUint8(byteIndex++));
    }
    if (byteIndex < bytesInCompressedStrip) {
        data.push(view.readUint8(byteIndex++));
    }

    let integer = 0;
    for (let i = 0; i < data.length; i++) {
        integer += data[i] * (256 ** (3 - i));
    }
    integer = integer << bitIndex;

    if (lut[((integer & parseInt('10000000000000000000000000000000', 2)) >> 31).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('10000000000000000000000000000000', 2)) >> 31).toString(2)], length: 1 };
    } else if (lut[((integer & parseInt('11000000000000000000000000000000', 2)) >> 30).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11000000000000000000000000000000', 2)) >> 30).toString(2)], length: 2 };
    } else if (lut[((integer & parseInt('11100000000000000000000000000000', 2)) >> 29).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11100000000000000000000000000000', 2)) >> 29).toString(2)], length: 3 };
    } else if (lut[((integer & parseInt('11110000000000000000000000000000', 2)) >> 28).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11110000000000000000000000000000', 2)) >> 28).toString(2)], length: 4 };
    } else if (lut[((integer & parseInt('11111000000000000000000000000000', 2)) >> 27).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111000000000000000000000000000', 2)) >> 27).toString(2)], length: 5 };
    } else if (lut[((integer & parseInt('11111100000000000000000000000000', 2)) >> 26).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111100000000000000000000000000', 2)) >> 26).toString(2)], length: 6 };
    } else if (lut[((integer & parseInt('11111110000000000000000000000000', 2)) >> 25).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111110000000000000000000000000', 2)) >> 25).toString(2)], length: 7 };
    } else if (lut[((integer & parseInt('11111111000000000000000000000000', 2)) >> 24).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111111000000000000000000000000', 2)) >> 24).toString(2)], length: 8 };
    } else if (lut[((integer & parseInt('11111111100000000000000000000000', 2)) >> 23).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111111100000000000000000000000', 2)) >> 23).toString(2)], length: 9 };
    } else if (lut[((integer & parseInt('11111111110000000000000000000000', 2)) >> 22).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111111110000000000000000000000', 2)) >> 22).toString(2)], length: 10 };
    } else if (lut[((integer & parseInt('11111111111000000000000000000000', 2)) >> 21).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111111111000000000000000000000', 2)) >> 21).toString(2)], length: 11 };
    } else if (lut[((integer & parseInt('11111111111100000000000000000000', 2)) >> 20).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111111111100000000000000000000', 2)) >> 20).toString(2)], length: 12 };
    } else if (lut[((integer & parseInt('11111111111110000000000000000000', 2)) >> 19).toString(2)] !== undefined) {
        return { data: lut[((integer & parseInt('11111111111110000000000000000000', 2)) >> 19).toString(2)], length: 13 };
    }
}

export default function huffmanDecoding() {
    const lut = {
        '0000110111': { color: 'black', length: 0, terminate: true },    
        '010': { color: 'black', length: 1, terminate: true },    
        '11': { color: 'black', length: 2, terminate: true },    
        '10': { color: 'black', length: 3, terminate: true },    
        '011': { color: 'black', length: 4, terminate: true },    
        '0011': { color: 'black', length: 5, terminate: true },    
        '0010': { color: 'black', length: 6, terminate: true },    
        '00011': { color: 'black', length: 7, terminate: true },    
        '000101': { color: 'black', length: 8, terminate: true },    
        '000100': { color: 'black', length: 9, terminate: true },    
        '0000100': { color: 'black', length: 10, terminate: true },    
        '0000101': { color: 'black', length: 11, terminate: true },    
        '0000111': { color: 'black', length: 12, terminate: true },    
        '00000100': { color: 'black', length: 13, terminate: true },    
        '00000111': { color: 'black', length: 14, terminate: true },    
        '000011000': { color: 'black', length: 15, terminate: true },    
        '0000010111': { color: 'black', length: 16, terminate: true },    
        '0000011000': { color: 'black', length: 17, terminate: true },    
        '0000001000': { color: 'black', length: 18, terminate: true },    
        '00001100111': { color: 'black', length: 19, terminate: true },    
        '00001101000': { color: 'black', length: 20, terminate: true },    
        '00001101100': { color: 'black', length: 21, terminate: true },    
        '00000110111': { color: 'black', length: 22, terminate: true },    
        '00000101000': { color: 'black', length: 23, terminate: true },    
        '00000010111': { color: 'black', length: 24, terminate: true },    
        '00000011000': { color: 'black', length: 25, terminate: true },    
        '000011001010': { color: 'black', length: 26, terminate: true },    
        '000011001011': { color: 'black', length: 27, terminate: true },    
        '000011001100': { color: 'black', length: 28, terminate: true },    
        '000011001101': { color: 'black', length: 29, terminate: true },    
        '000001101000': { color: 'black', length: 30, terminate: true },    
        '000001101001': { color: 'black', length: 31, terminate: true },    
        '000001101010': { color: 'black', length: 32, terminate: true },    
        '000001101011': { color: 'black', length: 33, terminate: true },    
        '000011010010': { color: 'black', length: 34, terminate: true },    
        '000011010011': { color: 'black', length: 35, terminate: true },    
        '000011010100': { color: 'black', length: 36, terminate: true },    
        '000011010101': { color: 'black', length: 37, terminate: true },    
        '000011010110': { color: 'black', length: 38, terminate: true },    
        '000011010111': { color: 'black', length: 39, terminate: true },    
        '000001101100': { color: 'black', length: 40, terminate: true },    
        '000001101101': { color: 'black', length: 41, terminate: true },    
        '000011011010': { color: 'black', length: 42, terminate: true },    
        '000011011011': { color: 'black', length: 43, terminate: true },    
        '000001010100': { color: 'black', length: 44, terminate: true },    
        '000001010101': { color: 'black', length: 45, terminate: true },    
        '000001010110': { color: 'black', length: 46, terminate: true },    
        '000001010111': { color: 'black', length: 47, terminate: true },    
        '000001100100': { color: 'black', length: 48, terminate: true },    
        '000001100101': { color: 'black', length: 49, terminate: true },    
        '000001010010': { color: 'black', length: 50, terminate: true },    
        '000001010011': { color: 'black', length: 51, terminate: true },    
        '000000100100': { color: 'black', length: 52, terminate: true },    
        '000000110111': { color: 'black', length: 53, terminate: true },    
        '000000111000': { color: 'black', length: 54, terminate: true },    
        '000000100111': { color: 'black', length: 55, terminate: true },    
        '000000101000': { color: 'black', length: 56, terminate: true },    
        '000001011000': { color: 'black', length: 57, terminate: true },    
        '000001011001': { color: 'black', length: 58, terminate: true },    
        '000000101011': { color: 'black', length: 59, terminate: true },    
        '000000101100': { color: 'black', length: 60, terminate: true },    
        '000001011010': { color: 'black', length: 61, terminate: true },    
        '000001100110': { color: 'black', length: 62, terminate: true },    
        '000001100111': { color: 'black', length: 63, terminate: true },    
        '00110101': { color: 'white', length: 0, terminate: true },    
        '000111': { color: 'white', length: 1, terminate: true },    
        '0111': { color: 'white', length: 2, terminate: true },    
        '1000': { color: 'white', length: 3, terminate: true },    
        '1011': { color: 'white', length: 4, terminate: true },    
        '1100': { color: 'white', length: 5, terminate: true },    
        '1110': { color: 'white', length: 6, terminate: true },    
        '1111': { color: 'white', length: 7, terminate: true },    
        '10011': { color: 'white', length: 8, terminate: true },    
        '10100': { color: 'white', length: 9, terminate: true },    
        '00111': { color: 'white', length: 10, terminate: true },    
        '01000': { color: 'white', length: 11, terminate: true },    
        '001000': { color: 'white', length: 12, terminate: true },    
        '000011': { color: 'white', length: 13, terminate: true },    
        '110100': { color: 'white', length: 14, terminate: true },    
        '110101': { color: 'white', length: 15, terminate: true },    
        '101010': { color: 'white', length: 16, terminate: true },    
        '101011': { color: 'white', length: 17, terminate: true },    
        '0100111': { color: 'white', length: 18, terminate: true },   
        '0001100': { color: 'white', length: 19, terminate: true },    
        '0001000': { color: 'white', length: 20, terminate: true },    
        '0010111': { color: 'white', length: 21, terminate: true },    
        '0000011': { color: 'white', length: 22, terminate: true },    
        '0000100': { color: 'white', length: 23, terminate: true },    
        '0101000': { color: 'white', length: 24, terminate: true },    
        '0101011': { color: 'white', length: 25, terminate: true },    
        '0010011': { color: 'white', length: 26, terminate: true },    
        '0100100': { color: 'white', length: 27, terminate: true },    
        '0011000': { color: 'white', length: 28, terminate: true },    
        '00000010': { color: 'white', length: 29, terminate: true },   
        '00000011': { color: 'white', length: 30, terminate: true },  
        '00011010': { color: 'white', length: 31, terminate: true },    
        '00011011': { color: 'white', length: 32, terminate: true },    
        '00010010': { color: 'white', length: 33, terminate: true },    
        '00010011': { color: 'white', length: 34, terminate: true },    
        '00010100': { color: 'white', length: 35, terminate: true },    
        '00010101': { color: 'white', length: 36, terminate: true },    
        '00010110': { color: 'white', length: 37, terminate: true },    
        '00010111': { color: 'white', length: 38, terminate: true },    
        '00101000': { color: 'white', length: 39, terminate: true },    
        '00101001': { color: 'white', length: 40, terminate: true },    
        '00101010': { color: 'white', length: 41, terminate: true },    
        '00101011': { color: 'white', length: 42, terminate: true },    
        '00101100': { color: 'white', length: 43, terminate: true },    
        '00101101': { color: 'white', length: 44, terminate: true },    
        '00000100': { color: 'white', length: 45, terminate: true },    
        '00000101': { color: 'white', length: 46, terminate: true },    
        '00001010': { color: 'white', length: 47, terminate: true },    
        '00001011': { color: 'white', length: 48, terminate: true },    
        '01010010': { color: 'white', length: 49, terminate: true },    
        '01010011': { color: 'white', length: 50, terminate: true },    
        '01010100': { color: 'white', length: 51, terminate: true },    
        '01010101': { color: 'white', length: 52, terminate: true },    
        '00100100': { color: 'white', length: 53, terminate: true },    
        '00100101': { color: 'white', length: 54, terminate: true },    
        '01011000': { color: 'white', length: 55, terminate: true },    
        '01011001': { color: 'white', length: 56, terminate: true },    
        '01011010': { color: 'white', length: 57, terminate: true },    
        '01011011': { color: 'white', length: 58, terminate: true },    
        '01001010': { color: 'white', length: 59, terminate: true },    
        '01001011': { color: 'white', length: 60, terminate: true },    
        '00110010': { color: 'white', length: 61, terminate: true },    
        '00110011': { color: 'white', length: 62, terminate: true },    
        '00110100': { color: 'white', length: 63, terminate: true },    
        '0000001111': { color: 'black', length: 64, terminate: false },    
        '000011001000': { color: 'black', length: 128, terminate: false },    
        '000011001001': { color: 'black', length: 192, terminate: false },    
        '000001011011': { color: 'black', length: 256, terminate: false },    
        '000000110011': { color: 'black', length: 320, terminate: false },    
        '000000110100': { color: 'black', length: 384, terminate: false },    
        '000000110101': { color: 'black', length: 448, terminate: false },    
        '0000001101100': { color: 'black', length: 512, terminate: false },    
        '0000001101101': { color: 'black', length: 576, terminate: false },    
        '0000001001010': { color: 'black', length: 640, terminate: false },    
        '0000001001011': { color: 'black', length: 704, terminate: false },    
        '0000001001100': { color: 'black', length: 768, terminate: false },    
        '0000001001101': { color: 'black', length: 832, terminate: false },    
        '0000001110010': { color: 'black', length: 896, terminate: false },    
        '0000001110011': { color: 'black', length: 960, terminate: false },    
        '0000001110100': { color: 'black', length: 1024, terminate: false },    
        '0000001110101': { color: 'black', length: 1088, terminate: false },    
        '0000001110110': { color: 'black', length: 1152, terminate: false },    
        '0000001110111': { color: 'black', length: 1216, terminate: false },    
        '0000001010010': { color: 'black', length: 1280, terminate: false },    
        '0000001010011': { color: 'black', length: 1344, terminate: false },    
        '0000001010100': { color: 'black', length: 1408, terminate: false },    
        '0000001010101': { color: 'black', length: 1472, terminate: false },    
        '0000001011010': { color: 'black', length: 1536, terminate: false },    
        '0000001011011': { color: 'black', length: 1600, terminate: false },    
        '0000001100100': { color: 'black', length: 1664, terminate: false },    
        '0000001100101': { color: 'black', length: 1728, terminate: false },    
        '11011': { color: 'white', length: 64, terminate: false },    
        '10010': { color: 'white', length: 128, terminate: false },    
        '010111': { color: 'white', length: 192, terminate: false },    
        '0110111': { color: 'white', length: 256, terminate: false },    
        '00110110': { color: 'white', length: 320, terminate: false },    
        '00110111': { color: 'white', length: 384, terminate: false },    
        '01100100': { color: 'white', length: 448, terminate: false },    
        '01100101': { color: 'white', length: 512, terminate: false },    
        '01101000': { color: 'white', length: 576, terminate: false },    
        '01100111': { color: 'white', length: 640, terminate: false },    
        '011001100': { color: 'white', length: 704, terminate: false },    
        '011001101': { color: 'white', length: 768, terminate: false },    
        '011010010': { color: 'white', length: 832, terminate: false },    
        '011010011': { color: 'white', length: 896, terminate: false },    
        '011010100': { color: 'white', length: 960, terminate: false },    
        '011010101': { color: 'white', length: 1024, terminate: false },    
        '011010110': { color: 'white', length: 1088, terminate: false },    
        '011010111': { color: 'white', length: 1152, terminate: false },    
        '011011000': { color: 'white', length: 1216, terminate: false },    
        '011011001': { color: 'white', length: 1280, terminate: false },    
        '011011010': { color: 'white', length: 1344, terminate: false },    
        '011011011': { color: 'white', length: 1408, terminate: false },    
        '010011000': { color: 'white', length: 1472, terminate: false },    
        '010011001': { color: 'white', length: 1536, terminate: false },    
        '010011010': { color: 'white', length: 1600, terminate: false },    
        '011000': { color: 'white', length: 1664, terminate: false },    
        '010011011': { color: 'white', length: 1728, terminate: false },    
        '000000000001': { color: 'white', length: 'EOL', terminate: false },    
        '00000000000': { color: 'black', length: 'EOL', terminate: false }  
    };

    const bytesInCompressedStrip = imageDescriptor.elements[279][stripIndex];
    let view = new DataView(dataView, imageDescriptor.elements[273][stripIndex], bytesInCompressedStrip);
    let readIndex, writeIndex = 0;
    let stripPixelData = new Uint8Array(new ArrayBuffer(image.SizeInBytes));

    for (let i = 0; i < imageDescriptor.elements[278][0]; i++) {
        let bitOffset = readIndex * 8;
        let totalRunLength = 0;

        while(totalRunLength < imageDescriptor[256][0]) {
            let { data, length } = readData(view, lut, bitOffset, bytesInCompressedStrip);
            bitOffset += length;
            totalRunLength += length;

            if(data.color === 'white') {
                stripPixelData.fill(0, writeIndex, writeIndex + length);
            } else {
                stripPixelData.fill(255, writeIndex, writeIndex + length);
            }

            writeIndex += length;
        }
        
        readIndex = (bitOffset - (bitOffset % 8)) / 8 + 1 ;
    }

    return stripPixelData;
}