import standardDataElements from '../utils/dicomDict.js';
import CSImage from '../utils/CSImage.js';

export default function getFileMetadata(element) {
    let CSimage = CSImage.instances.get(element);
    if (CSimage.layers[0].format === 'dicom' || CSimage.layers[0].format === 'dcm') {
        let request = new XMLHttpRequest();
        let metatext = element.parentElement.getElementsByClassName('metadata-text')[0];
        request.responseType = 'blob';
        request.onload = function(e) {
            this.response.arrayBuffer().then(buffer => {


                
                metatext.innerHTML = "";
                let Uint8View = new Uint8Array(buffer);
                if (Object.keys(CSimage.dataset).length === 0) {
                    CSimage.dataset = dicomParser.parseDicom(Uint8View);
                }

                Object.keys(CSimage.dataset.elements).forEach(tag => {
                    try {
                        metatext.innerHTML += standardDataElements[tag.slice(1).toUpperCase()]['name'] + ': ' +  CSimage.dataset.string(tag) + '<br>';
                    } catch {
                        CSimage.dataset.warnings.push('unable to read tag \'' + tag + '\'');
                    }
                })

                CSimage.dataset.warnings.forEach(warning => {
                    metatext.innerHTML += warning + '<br>';
                })

            })
        }
        request.open('GET', CSimage.layers[0].stack[CSimage.currentTimeIndex].imageIds[CSimage.layers[0].stack[CSimage.currentTimeIndex].currentImageIdIndex], true);
        request.send();
    }
}