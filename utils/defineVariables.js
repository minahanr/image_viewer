const fileFormats = {
    dicom: 'wadouri:',
    dcm: 'wadouri:',
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
    tiff: '',
    tif: ''
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

const filePath = 'https://github.com/minahanr/image_viewer/blob/master/test_NeckHeadCT'
const currentfileFormat = 'dcm';
const num_images = 113;
var movieReverse = false;

var stack = {
    currentImageIdIndex: 0,
    imageIds: []
}

const max_str_len = Math.floor(Math.log10(num_images));
for (let i = 1; i <= num_images; i++) {
    let i_str_len = Math.floor(Math.log10(i));
    let i_str = '0'.repeat(max_str_len - i_str_len) + i

    stack['imageIds'].push(fileFormats[currentfileFormat] + filePath + '/' + 1 + '-' + i_str + '.' + currentfileFormat + '?raw=true')
}