import { splitImageHorizontal, splitImageVertical } from './tools/modifyImageWindows.js';
import {loadCoaxialImage_1, loadCoaxialImage_2 } from './imageLoaders/projectionLoader/loadImage.js';
import updateDescription from './tools/updateDescription.js';

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
    if (newTool in Object.values(mouseButtons)) {
        return;
    }

    cornerstoneTools.setToolEnabled(mouseButtons[mouseButton], {});
    cornerstoneTools.setToolActive(newTool, { mouseButtonMask : mouseButton } );
    mouseButtons[mouseButton] = newTool;
}

let subtitleNames = document.getElementsByClassName('sub-title-name');
subtitleNames.forEach(element => {
    element.addEventListener('click', e => {
        document.getElementsByClassName('sub-title-name').forEach(e2 => {
            let classList = e2.getElementsByTagName('i')[0].classList;
            if (e2 === e.target) {
                e2.parentElement.getElementsByClassName('dropdown')[0].classList.toggle('visible');
                if (classList.contains('up')) {
                    classList.remove('up');
                    classList.add('down');
                } else {
                    classList.add('up');
                    classList.remove('down');
                }

            } else {
                e2.parentElement.getElementsByClassName('dropdown')[0].classList.remove('visible');
                classList.remove('up');
                classList.add('down');
            }
        });
    });
});

document.getElementsByClassName('tool').forEach(tool => {
    tool.addEventListener('click', evt => {
        updateDescription(evt.target);
        switchTool(evt.target.id, 1);
    });
});

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