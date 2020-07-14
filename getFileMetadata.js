import standardDataElements from './utils/dicomDict.js';

export default function getFileMetadata(frame) {
    let request = new XMLHttpRequest();
    let element = document.getElementById('image_' + frame).parentElement.getElementsByClassName('metadata-text')[0];
    request.responseType = 'blob';
    request.onload = function(e) {
        this.response.arrayBuffer().then(buffer => {

            let simpleBar = SimpleBar.instances.get(element);
            if (simpleBar !== undefined) {
                simpleBar.unMount();
            }
            
            element.innerHTML = "";
            let Uint8View = new Uint8Array(buffer);
            let dataset = dicomParser.parseDicom(Uint8View);

            Object.keys(dataset.elements).forEach(tag => {
                try {
                    element.innerHTML += standardDataElements[tag.slice(1).toUpperCase()]['name'] + ': ' +  dataset.string(tag) + '<br>';
                } catch {
                    dataset.warnings.push('unable to read tag \'' + tag + '\'');
                }
            })

            dataset.warnings.forEach(warning => {
                element.innerHTML += warning + '<br>';
            })

            simpleBar = new SimpleBar(element);
        })
    }
    request.open('GET', stack[frame]['imageIds'][stack[frame]['currentImageIdIndex']], true);
    request.send();
}