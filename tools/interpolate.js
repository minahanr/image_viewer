export default function interpolate(e) {
    let element = e.target.parentElement.parentElement;
    let viewport = cornerstone.getViewport(element);
    viewport.pixelReplication = !viewport.pixelReplication;
    cornerstone.setViewport(element, viewport);
}