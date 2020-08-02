import defineVariables from "../../utils/defineVariables.js";

export default function parseIFD(byteStream) {
    var tag = byteStream.readUint16();
    var type = byteStream.readUint16();
    var count = byteStream.readUint32();
    var offset = byteStream.readUint32();

    var IFD = {
        tag: tag,
        type: type,
        count: count,
        offset: offset
    };

    if (defineVariables().typeSize[type] * count <= 4)
        IFD['value'] = IFD['offset'];

    return IFD
}