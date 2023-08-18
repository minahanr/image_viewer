
import { splitImageHorizontal, splitImageVertical } from './tools/modifyImageWindows.js';
import updateDescription from './tools/updateDescription.js';
import CSImage from './utils/CSImage.js';
import updateTheImage from './utils/updateImageSelector.js';
import dropdown_util from './utils/dropdown_util.js';
import loadTiff from './imageLoaders/tiffLoader.js';
import { loadFrontalImage, loadCoaxialImage, loadSagitalImage } from './imageLoaders/projectionLoader/loadImage.js';
import populateGrid from './tools/populateGrid.js';
    // main code here 
  
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader('frontal', loadFrontalImage);
cornerstone.registerImageLoader('coaxial', loadCoaxialImage);
cornerstone.registerImageLoader('sagital', loadSagitalImage);
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

document.getElementById('database-browser').getElementsByClassName('tablink').forEach(tab => {
    tab.addEventListener('click', e => {
        document.getElementById('database-browser').getElementsByClassName('tablink').forEach(tab => {
            if (tab === e.target) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });
        
        if (e.target.innerHTML === "Selected images") {
            document.getElementById('selected-image-results').style.display = "block";
            document.getElementById('database-image-results').style.display = "none";
        } else {
            document.getElementById('selected-image-results').style.display = "none";
            document.getElementById('database-image-results').style.display = "block";
        }
    });
});

// document.getElementById('db-browser').addEventListener('click', evt => {
//     let url = "browser/browser.php";
//     let db_name = "database_browser";
//     let specs = "height=500,width=400,menubar=no,status=no,titlebar=no";
//     var browser = window.open(url, db_name, specs);
// });

// document.getElementById('refresh-db').addEventListener('click', evt => {
//     var selected_rows = document.cookie.split('; ').find(row => row.startsWith('selected_rows=')).split('=')[1];
//     selected_rows = JSON.parse(decodeURIComponent(selected_rows));
//     var index = Object.keys(imageSeriesDict).length;

//     selected_rows.forEach(row => {
//         if (imageSeriesDict[row.series_id] !== undefined) {
//             console.warn('Image series ID has been repeated. Ignoring image series.');
//         } else {
//             var entry = {
//                 series_id: row.series_id,
//                 baseURL: row.base_url,
//                 format: row['format'],
//                 numFrames: parseInt(row.num_frames),
//                 imgsPerFrame: parseInt(row.imgs_per_frame),
//                 name: row.name,
//                 modality: row.modality,
//                 subject: row.subject
//             };

//             imageSeries.push(entry);
//             imageSeriesDict[entry.series_id] = index;
//             index += 1;
//         }


//     });

//     document.getElementById('image-database').getElementsByClassName('dropdown').forEach(e => {
//         e.classList.remove('visible');
//     });

//     document.getElementById('image-database').getElementsByClassName('arrow').forEach(e => {
//         e.classList.remove('up');
//         e.classList.add('down');
//     });

//     console.log(imageSeriesDict);
// });

createGrid(1, 1);
populateGrid(document.getElementById('grid').getElementsByClassName('image-container')[0], imageSeriesDict[chosen_id], { name: imageSeries[imageSeriesDict[chosen_id]].name })