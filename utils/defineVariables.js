export default function defineVariables() {
    const fileFormats = {
        dicom: 'wadouri:',
        dcm: 'wadouri:',
        tiff: 'tiff:',
        tif: 'tiff:',
        jpg: '',
        jpeg: '',
        jpe: '',
        jfif: '',
        pjpeg: '',
        pjp: '',
        png: '',
        apng: '',
        bmp: '',
        gif: '',
        ico: '',
        cur: '',
        svg: '',
        webp: '',
    };

    const typeSize = {
        1: 1,
        2: 1,
        3: 2,
        4: 4,
        5: 8,
        6: 1,
        7: 1,
        8: 2,
        9: 4,
        10: 8,
        11: 4,
        12: 8
    };

    const supportedTags = [
        'imageWidth',
        'imageLength',
        'bitsPerSample',
        'compression',
        'photoInterp',
        'stripOffsets',
        'rowsPerStrip',
        'stripByteCounts',
        'xRes',
        'yRes',
        'resUnit',
        'colorMap',
        'documentName'
    ];

    return {
        fileFormats,
        typeSize,
        supportedTags
    };
}
