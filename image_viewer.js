import { splitImageHorizontal, splitImageVertical } from './tools/modifyImageWindows.js';
import updateDescription from './tools/updateDescription.js';
import CSImage from './utils/CSImage.js';
import updateTheImage from './utils/updateImageSelector.js';
import dropdown_util from './utils/dropdown_util.js';
import loadTiff from './imageLoaders/tiffLoader.js';
import populateGrid from './tools/populateGrid.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader('web', cornerstoneWebImageLoader.loadImage);
cornerstone.registerImageLoader('tiff', loadTiff);

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
    CSImage.highlightedLayer().options.opacity = parseFloat(evt.currentTarget.value);
    updateTheImage(CSImage.highlightedElement(), CSimage.currentImageIdIndex);
});

document.getElementById('colormaps').addEventListener('change', evt => {
    let CSimage = CSImage.instances().get(CSImage.highlightedElement());
    CSImage.highlightedLayer().colormap = document.getElementById('colormaps').value;
    let layer = cornerstone.getLayer(CSimage.element, CSImage.highlightedLayer().uid);
    layer.viewport.colormap = CSImage.highlightedLayer().colormap;
    updateTheImage(CSImage.highlightedElement(), CSimage.currentImageIdIndex);
    cornerstone.updateImage(CSImage.highlightedElement());
});

createGrid(1, 1);
populateGrid(document.getElementById('grid').getElementsByClassName('image-container')[0], imageSeriesDict[chosen_id], { name: imageSeries[imageSeriesDict[chosen_id]].name })