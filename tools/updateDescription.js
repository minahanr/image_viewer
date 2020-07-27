export default function updateDescription(tool) {
    const name = tool.id;
    const description = tool.parentElement.getElementsByClassName('description')[0];

    if (name === 'Zoom') {
        description.innerHTML = 'Zooms in and out on the center of the image.';
    } else if (name === 'Pan') {
        description.innerHTML = 'Pans around the image.';
    } else if (name === 'Magnify') {
        description.innerHTML = 'Allows one to zoom in on a specific location while maintaining a wider focus for the surrounding region.';
    } else if (name === 'ModifiedCrosshairs') {
        description.innerHTML = 'Creates a crosshair UI in place of the cursor. If the image is projected to other axes, will also move those images accordingly and project the crosshair there as well.';
    } else if (name === 'Angle') {
        description.innerHTML = 'Create two lines connected by a point, and then describe the angle.';
    } else if (name === 'CobbAngle') {
        description.innerHTML = 'Create two lines not necessarily connected, and then describe the angle.';
    } else if (name === 'Length') {
        description.innerHTML = 'Draw a line which will be measured in length.';
    } else if (name === 'Probe') {
        description.innerHTML = 'Gives the location and RGB label (if color) of a point on the image.';
    } else if (name === 'ArrowAnnotate') {
        description.innerHTML = 'Allows one to draw and annotate an arrow pointing to a location.';
    } else if (name === 'Bidirectional') {
        description.innerHTML = 'Not entirely sure lol.';
    } else if (name === 'Rotate') {
        description.innerHTML = 'Rotates the image.';
    } else if (name === 'Wwwc') {
        description.innerHTML = 'Adjusts the levels of an image.';
    } else if (name === 'WwwcRegion') {
        description.innerHTML = 'Adjusts the levels of an image to fit a certain rectangle.';
    } else if (name === 'Brush') {
        description.innerHTML = 'Allows one to highlight areas of the image.';
    } else if (name === 'EllipticalRoi') {
        description.innerHTML = 'Creates an elliptical and then gives the area within the RoI.';
    } else if (name === 'RectangleRoi') {
        description.innerHTML = 'Creates a rectangle and then gives the area within the RoI.';
    } else if (name === 'FreehandRoi') {
        description.innerHTML = 'Allows one to draw an area and then gives the area within the RoI.';
    }
}