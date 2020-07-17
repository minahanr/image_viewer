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

console.log('test');

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

