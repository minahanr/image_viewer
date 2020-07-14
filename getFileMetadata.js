import standardDataElements from './utils/dicomDict.js';
import CSImage from './utils/CSImage.js';

export default function getFileMetadata(element) {
    let CSimage = CSImage.instances.get(element);
    let request = new XMLHttpRequest();
    let metatext = element.parentElement.getElementsByClassName('metadata-text')[0];
    request.responseType = 'blob';
    request.onload = function(e) {
        this.response.arrayBuffer().then(buffer => {

            let simpleBar = SimpleBar.instances.get(metatext);
            if (simpleBar !== undefined) {
                simpleBar.unMount();
            }
            
            metatext.innerHTML = "";
            let Uint8View = new Uint8Array(buffer);
            let dataset = dicomParser.parseDicom(Uint8View);

            Object.keys(dataset.elements).forEach(tag => {
                try {
                    metatext.innerHTML += standardDataElements[tag.slice(1).toUpperCase()]['name'] + ': ' +  dataset.string(tag) + '<br>';
                } catch {
                    dataset.warnings.push('unable to read tag \'' + tag + '\'');
                }
            })

            dataset.warnings.forEach(warning => {
                metatext.innerHTML += warning + '<br>';
            })

            simpleBar = new SimpleBar(metatext);
        })
    }
    request.open('GET', CSimage.stack['imageIds'][CSimage.stack['currentImageIdIndex']], true);
    request.send();
}