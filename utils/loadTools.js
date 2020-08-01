import CSImage from './CSImage.js';
import ScrollWheelUpdaterTool from '../tools/ScrollWheelUpdater.js';
import ModifiedCrosshairsTool from '../tools/Crosshairs.js';
const cursors = cornerstoneTools.importInternal('tools/cursors');
console.log(cursors);
export default function loadTools(element) {
    cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool); 
    cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool, {
        configuration: {
            invert: false,
            preventZoomOutsideImage: false,
        }
    });
    cornerstoneTools.addToolForElement(element, ScrollWheelUpdaterTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools['BrushTool']);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.MagnifyTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.RotateTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcRegionTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.AngleTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.CobbAngleTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.EllipticalRoiTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.RectangleRoiTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.FreehandRoiTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.LengthTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.ProbeTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.ArrowAnnotateTool);
    cornerstoneTools.addToolForElement(element, cornerstoneTools.BidirectionalTool);
    cornerstoneTools.addToolForElement(element, ModifiedCrosshairsTool);

    cornerstoneTools.setToolActiveForElement(element, CSImage.activeTools().leftClickTool, { mouseButtonMask: 1 });  
    cornerstoneTools.setToolActiveForElement(element, 'ScrollWheelUpdater', {});
    cornerstoneTools.setToolActiveForElement(element, CSImage.activeTools().rightClickTool, { mouseButtonMask: 2});
}