import { splitImageHorizontal, splitImageVertical } from './tools/modifyImageWindows.js';
import loadImage from './imageLoaders/projectionLoader/loadImage.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader('mpr', loadImage);

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
    mouseEnabled: true,
    showSVGcursors: false
});


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
document.getElementById('URLs').innerHTML = '';

for (let i = 1; i < 114; i++) {
    document.getElementById('URLs').innerHTML += 'https://github.com/minahanr/image_viewer/blob/master/test_NeckHeadCT/1-' + '0'.repeat(2 - Math.floor(Math.log10(i))) + i + '.dcm?raw=true ';
}

document.getElementById('URLs').innerHTML = document.getElementById('URLs').innerHTML.slice(0, -1);