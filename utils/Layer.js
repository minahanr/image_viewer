import standardDataElements from '../utils/dicomDict.js';
class Layer {
    constructor(id, name, format, urlsOverTime, options) {
        if (options !== undefined && options.name !== undefined) {
            name = options.name;
        }
        if (options !== undefined && options.sliceThickness !== undefined) {
            this.sliceThickness = options.sliceThickness;
        }
        
        this.uid = undefined;
        this.id = id;
        this.name = name;
        this.format = format;
        this.startingTimeIndex = 0;
        this.startingSpaceIndex = 0;
        
        if (options === undefined) {
            this.options = {};
        } else {
            this.options = options;
        };

        if (urlsOverTime === []) {
            
            this.stack = urlsOverTime;
        } else if (urlsOverTime[0].currentImageIdIndex !== undefined){
            this.stack = urlsOverTime;
        } else {
            this.stack = [];
            urlsOverTime.forEach(urls => this.stack.push({imageIds: urls, currentImageIdIndex: 0}));
        }
        if (this.options.dataset === undefined) {
            this.options.dataset = {};
            this.getFileMetadata();
        }
    }

    getFileMetadata() {
        if (this.format === 'dicom' || this.format === 'dcm') {
            let layer = this;
            let request = new XMLHttpRequest();
            request.responseType = 'arraybuffer';
            request.onload = function(e) {
                let buffer = request.response;
                
                let Uint8View = new Uint8Array(buffer);
                if (Object.keys(layer.options.dataset).length === 0) {
                    layer.options.dataset = dicomParser.parseDicom(Uint8View);
                }
                
                layer.options.dataset.metadata = '';
                Object.keys(layer.options.dataset.elements).forEach(tag => {
                    try {
                        layer.options.dataset.metadata += standardDataElements[tag.slice(1).toUpperCase()]['name'] + ': ' +  layer.options.dataset.string(tag) + '<br>';
                    } catch(error) {
                        layer.options.dataset.warnings.push('unable to read tag \'' + tag + '\'');
                    }
                });
    
                layer.options.dataset.warnings.forEach(warning => {
                    layer.options.dataset.metadata += warning + '<br>';
                });
            }
            request.open('GET', this.stack[0].imageIds[0], true);
            request.send();
        }
    }
}

const obj = {
    Layer
}

export default obj;