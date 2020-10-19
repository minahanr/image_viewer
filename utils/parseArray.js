export default function parseArray(imageIndex, projection) {
    const baseURL = imageSeries[imageIndex].baseURL;
    const format = imageSeries[imageIndex].format;
    const numFrames = imageSeries[imageIndex].numFrames
    const imgsPerFrame = imageSeries[imageIndex].imgsPerFrame
    const startingTimeIndex = 1;
    const startingSpaceIndex = 1;
    let urlsOverTime = [];
    
    // if (numFrames !== 1) {
    //     for (let i = 0; i < numFrames; i++) {
    //         urlsOverTime.push([]);
    //         for (let j = 0; j < imgsPerFrame; j++) {
    //             urlsOverTime[i].push(baseURL + '/' + '0'.repeat(1 - Math.floor(Math.log10(Math.max(i + startingTimeIndex, 1)))) + (i + startingTimeIndex) + '/' + 'IM-' + '0'.repeat(3 - Math.floor(Math.log10(Math.max(i + startingTimeIndex, 1)))) + (i + startingTimeIndex) + '-' + '0'.repeat(3 - Math.floor(Math.log10(Math.max(1, i * imgsPerFrame + j + 1)))) + (i * imgsPerFrame + j + 1) + '.' + format + '?raw=true');
    //         }
    //     }
    // } else {
    //     urlsOverTime.push([]);
    //     for(let i = 0; i < imgsPerFrame; i++) {
    //         urlsOverTime[0].push(baseURL + '/' + (1) + '-' + '0'.repeat((Math.floor(Math.log10(imgsPerFrame))) - Math.floor(Math.log10(Math.max(i + startingSpaceIndex, 1)))) + (i + startingSpaceIndex) + '.' + format + '?raw=true');
    //     }
    // }

    for (let i = 0; i < numFrames; i++) {
        urlsOverTime.push([]);
        for(let j = 0; j < imgsPerFrame; j++) {
            urlsOverTime[i].push(baseURL + '/' + projection + '/' + '0'.repeat(Math.floor(Math.log10(numFrames)) - Math.floor(Math.log10(Math.max(i + startingTimeIndex, 1)))) + (i + startingTimeIndex) + '-' + '0'.repeat(Math.floor(Math.log10(imgsPerFrame)) - Math.floor(Math.log10(Math.max(j + startingSpaceIndex, 1)))) + (j + startingSpaceIndex) + '.' + format + '?raw=true');
        }
    }

    return { urlsOverTime, format, startingTimeIndex };
}