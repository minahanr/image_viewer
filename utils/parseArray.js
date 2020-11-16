export default function parseArray(imageIndex, projection) {
    const baseURL = imageSeries[imageIndex].baseURL;
    const format = imageSeries[imageIndex].format;
    const numFrames = imageSeries[imageIndex].numFrames
    const imgsPerFrame = imageSeries[imageIndex].imgsPerFrame
    const startingTimeIndex = 1;
    let urlsOverTime = [];

    for (let i = 0; i < numFrames; i++) {
        urlsOverTime.push([]);
        for(let j = 0; j < imgsPerFrame; j++) {
            urlsOverTime[i].push(baseURL + '/' + projection + '/' + '0'.repeat(Math.floor(Math.log10(numFrames)) - Math.floor(Math.log10(Math.max((i + 1), 1)))) + (i  + 1) + '-' + '0'.repeat(Math.floor(Math.log10(imgsPerFrame)) - Math.floor(Math.log10(Math.max(j + 1, 1)))) + (j + 1) + '.' + format + '?raw=true');
        }
    }

    return { urlsOverTime, format, startingTimeIndex };
}