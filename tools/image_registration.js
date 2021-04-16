

function interpolation(CSimage, time, x, y, z) {
    promises = [];
    promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[layer.format] + layer.baseURL + '/' + CSimage.projection + '/' + layer.stack[CSimage.currentTimeIndex].imageIds[floor(z)]));
    promises.push(cornerstone.loadAndCacheImage(defineVariables().fileFormats[layer.format] + layer.baseURL + '/' + CSimage.projection + '/' + layer.stack[CSimage.currentTimeIndex].imageIds[ceil(z)]));
    promises.all.then(images => {
        p1 = images[0].getPixelData(floor(x) + floor(y) * images[0].columns); //floor(x), floor(y), floor(z)
        p2 = images[1].getPixelData(floor(x) + floor(y) * images[1].columns); //floor(x), floor(y), ceil(z)
        p3 = images[0].getPixelData(floor(x) + ceil(y) * images[0].columns); //floor(x), ceil(y), floor(z)
        p4 = images[1].getPixelData(floor(x) + ceil(y) * images[1].columns); //floor(x), ceil(y), ceil(z)
        p5 = images[0].getPixelData(ceil(x) + floor(y) * images[0].columns); //ceil(x), floor(y), floor(z)
        p6 = images[1].getPixelData(ceil(x) + floor(y) * images[1].columns); //ceil(x), floor(y), ceil(z)
        p7 = images[0].getPixelData(ceil(x) + ceil(y) * images[0].columns); //ceil(x), ceil(y), floor(z)
        p8 = images[1].getPixelData(ceil(x) + ceil(y) * images[1].columns); //ceil(x), ceil(y), ceil(z)

        

    });
}


function gradient_descent(params, learning_rate, num_iter, sample_size, image) {
    transform_matrix;
    for(i = 0; i < num_iter; i++) {
        sample = generate_sample(sample_size);

    }
}

export default function image_registration(CSimage) {
    image = new Array();
    CSimage.layers[0].stack.imageIds.forEach(ele => {
        image.push(ele);
    });

    gradient_descent
};