import { splitImageHorizontal, splitImageVertical } from './tools/modifyImageWindows.js';
import {loadCoaxialImage_1, loadCoaxialImage_2 } from './imageLoaders/projectionLoader/loadImage.js';
import updateDescription from './tools/updateDescription.js';
import CSImage from './utils/CSImage.js';
import updateTheImage from './utils/updateImageSelector.js';
import dropdown_util from './utils/dropdown_util.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader('LCI1', loadCoaxialImage_1);
cornerstone.registerImageLoader('LCI2', loadCoaxialImage_2);

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
    mouseEnabled: true,
    showSVGCursors: true
});

function createGrid(rows, cols) {
    let grid = document.getElementById('grid');
    splitImageHorizontal(grid, rows).forEach(row => { splitImageVertical(row, cols); } );
}

function switchTool(newTool, mouseButton) {
    let activeTools = CSImage.activeTools();

    if (mouseButton === 'leftClick') {
        if (newTool === activeTools.leftClickTool) {
            return;
        }

        cornerstoneTools.setToolEnabled(activeTools.leftClickTool, {});
        activeTools.setLeftClick(newTool);
    } else {
        if (newTool === activeTools.rightClickTool) {
            return;
        }

        cornerstoneTools.setToolEnabled(activeTools.rightClickTool, {});
        activeTools.setRightClick(newTool);
    }

    cornerstoneTools.setToolActive(newTool, { mouseButtonMask : activeTools.dict[mouseButton] } );
}

let subtitleNames = document.getElementsByClassName('sub-title-name');
subtitleNames.forEach(element => {
    element.addEventListener('click', evt => dropdown_util(evt.target));
});

document.getElementsByClassName('tool').forEach(tool => {
    tool.addEventListener('click', evt => {
        updateDescription(evt.target);
        switchTool(evt.target.id, 'leftClick');
    });
});

document.getElementById('opacitySlider').addEventListener('change', evt => {
    let CSimage = CSImage.instances().get(CSImage.highlightedElement());
    console.log(CSImage.highlightedLayer());
    CSImage.highlightedLayer().options.opacity = parseFloat(evt.currentTarget.value);
    updateTheImage(CSImage.highlightedElement(), CSimage.currentImageIdIndex);
});

document.getElementById('colormaps').addEventListener('change', evt => {
    let CSimage = CSImage.instances().get(CSImage.highlightedElement());
    let layer = cornerstone.getLayer(CSimage.element, CSImage.highlightedLayer().uid);
    CSImage.highlightedLayer().options.colormap = document.getElementById('colormaps').value;
    layer.viewport.colormap = document.getElementById('colormaps').value;
    cornerstone.updateImage(CSImage.highlightedElement());
});

// document.getElementById('colormaps').addEventListener('change', evt => {

// });
// document.getElementById('toolbar').getElementsByClassName('mouseLeft').forEach(element => {
//     element.addEventListener('click', function() {
//         switchTool(element.parentElement.parentElement.id, 1);
//     });
// });

// document.getElementById('toolbar').getElementsByClassName('mouseRight').forEach(element => {
//     element.addEventListener('click', function() {
//         switchTool(element.parentElement.parentElement.id, 2);
//     });
// });
createGrid(1, 1);