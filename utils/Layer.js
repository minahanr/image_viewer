import standardDataElements from '../utils/dicomDict.js';
export default class Layer {
    constructor(id, name, format, urlsOverTime, startingIndex) {
        this.uid = undefined;
        this.id = id;
        this.name = name;
        this.format = format;
        this.startingIndex = startingIndex;
        this.options = {};
        this.dataset = {};
        this.metadata = '';

        if (urlsOverTime[0].currentImageIdIndex !== undefined){
            this.stack = urlsOverTime;
        } else {
            this.stack = [];
            urlsOverTime.forEach(urls => this.stack.push({imageIds: urls, currentImageIdIndex: 0}));
        }

        this.getFileMetadata();
    }

    getFileMetadata() {
        if (this.format === 'dicom' || this.format === 'dcm') {
            let layer = this;
            let request = new XMLHttpRequest();
            request.responseType = 'arraybuffer';
            request.onload = function(e) {
                let buffer = request.response;
                this.metadata = '';
                let Uint8View = new Uint8Array(buffer);
                if (Object.keys(layer.dataset).length === 0) {
                    layer.dataset = dicomParser.parseDicom(Uint8View);
                }
    
                Object.keys(layer.dataset.elements).forEach(tag => {
                    try {
                        layer.metadata += standardDataElements[tag.slice(1).toUpperCase()]['name'] + ': ' +  layer.dataset.string(tag) + '<br>';
                    } catch {
                        layer.dataset.warnings.push('unable to read tag \'' + tag + '\'');
                    }
                });
    
                layer.dataset.warnings.forEach(warning => {
                    layer.metadata += warning + '<br>';
                });
            }
            request.open('GET', this.stack[0].imageIds[0], true);
            request.send();
        }
    }
}