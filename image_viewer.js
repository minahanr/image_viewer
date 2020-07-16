import parseTiff from './parsers/tiffParser/parseTiff.js';
import { createHorizontalBorder, createContainer } from './tools/createContainer.js';
import { splitImageHorizontal, splitImageVertical } from './tools/modifyImageWindows.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
    mouseEnabled: true,
    showSVGcursors: false
});

var test = new XMLHttpRequest();
test.open('GET', 'https://github.com/minahanr/image_viewer/blob/master/test_tiff/1-01.tiff?raw=true', true);
test.responseType = 'blob';
test.onload = function(e) {
    if(this.status == 200) {
        let image = this.response.arrayBuffer().then(buffer => { 
            var Uint8View = new Uint8Array(buffer);
            var tags = parseTiff(Uint8View);
            for (let i = 0; i < supportedTags.length; i++) {
                console.log(supportedTags[i] + ': ' + tags.getMetadata(supportedTags[i]));
            }
        });
        
    }
}

test.send();

function createGrid(rows, cols) {
    let grid = document.getElementById('grid');
    splitImageHorizontal(grid, rows).forEach(row => { splitImageVertical(row, cols); } );
}

function switchTool(newTool, mouseButton) {
    if (newTool in Object.values(mouseButtons)) {
        return;
    }

    cornerstoneTools.setToolEnabled(mouseButtons[mouseButton], {});
    cornerstoneTools.setToolActive(newTool, { mouseButtonMask : mouseButton } );
    mouseButtons[mouseButton] = newTool;
}

document.getElementById('toolbar').getElementsByClassName('mouseLeft').forEach(element => {
    element.addEventListener('click', function() {
        switchTool(element.parentElement.parentElement.id, 1);
    });
});

document.getElementById('toolbar').getElementsByClassName('mouseRight').forEach(element => {
    element.addEventListener('click', function() {
        switchTool(element.parentElement.parentElement.id, 2);
    });
});
createGrid(3, 3);

