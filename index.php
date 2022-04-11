<?php
    session_start();
?>

<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <!-- twitter bootstrap CSS stylesheet - included to make things pretty, not needed or used by cornerstone -->
    <link href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <link href="dist/simpleBar/simplebar.css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Source+Serif+Pro' rel='stylesheet' type='text/css'>
    <noscript>
        <style>
          [data-simplebar] {
            overflow: auto;
          }
        </style>
      </noscript>

</head>
<body>
    <noscript>You need javascript to run this</noscript>
    <root>
        <div class="container" id="root-container">
            <div id="titlebar"><img src='images/canary_logo.png' width="60px" height="50.19px" style='margin-right: 30px; margin-top: -10px'>Canary Center Image Viewer</div>
            <div id='viewer-container'>
                <div id='navigation-panel'>
                    <div id='tools-viewer' class='sub-panel'>
                        <div class='panel-title'>Tools </div>
                        <div class='sub-title'>
                            <div class='sub-title-name'>
                                Navigation <i class="arrow down"></i>
                            </div>
                            <div class='dropdown'>
                                <img id="Zoom" class='tool button' src='images/metadata.png'>
                                <img id="Pan" class='tool button' src='images/metadata.png'>
                                <img id="Magnify" class='tool button' src='images/metadata.png'>
                                <img id="ModifiedCrosshairs" class='tool button' src='images/metadata.png'>
                                <div class='description'></div>
                            </div>
                        </div>
                        <div class='sub-title'>
                            <div class='sub-title-name'>
                                Annotation <i class="arrow down"></i>
                            </div>
                            <div class='dropdown'>
                                <img id="Angle" class='tool button' src='images/metadata.png'>
                                <img id="CobbAngle" class='tool button' src='images/metadata.png'>
                                <img id="Length" class='tool button' src='images/metadata.png'>
                                <img id="Probe" class='tool button' src='images/metadata.png'>
                                <img id="ArrowAnnotate" class='tool button' src='images/metadata.png'>
                                <img id="Bidirectional" class='tool button' src='images/metadata.png'>
                                <div class='description'></div>
                            </div>
                        </div>
                        <div class='sub-title'>
                            <div class='sub-title-name'>
                                Transformation <i class="arrow down"></i>
                            </div>
                            <div class='dropdown'>
                                <img id="Rotate" class='tool button' src='images/metadata.png'>
                                <img id="Wwwc" class='tool button' src='images/metadata.png'>
                                <img id="WwwcRegion" class='tool button' src='images/metadata.png'>
                                <div class='description'></div>
                            </div>
                        </div>
                        <div class='sub-title'>
                            <div class='sub-title-name'>
                                Segmentation <i class="arrow down"></i>
                            </div>
                            <div class='dropdown'>
                                <img id="Brush" class='tool button' src='images/metadata.png'>
                                <img id="EllipticalRoi" class='tool button' src='images/metadata.png'>
                                <img id="RectangleRoi" class='tool button' src='images/metadata.png'>
                                <img id="FreehandRoi" class='tool button' src='images/metadata.png'>
                                <div class='description'></div>
                            </div>
                        </div>
                    </div>
                    <div id='layers-viewer' class='sub-panel'>
                        
                        <div class='panel-title'>Layers</div>
                        <div class='container'>
                            <label for='opacitySlider'>Opacity</label>
                            <input type='range' min='0' max='1' step='.01' value='1.00' id='opacitySlider'>
                        </div>
                        <div class='container'>
                            <label for='colormaps'>Color scheme</label>
                            <select id="colormaps">
                                <option value="" selected='selected'>None</option>
                                <option value="autumn">Autumn</option>
                                <option value="blues">Blues</option>
                                <option value="bone">Bone</option>
                                <option value="cool">Cool</option>
                                <option value="coolwarm">CoolWarm</option>
                                <option value="copper">Copper</option>
                                <option value="gray">Gray</option>
                                <option value="hot">Hot</option>
                                <option value="hotIron">Hot Iron</option>
                                <option value="hotMetalBlue">Hot Metal Blue</option>
                                <option value="hsv">HSV</option>
                                <option value="jet">Jet</option>
                                <option value="pet">PET</option>
                                <option value="pet20Step">PET 20 Step</option>
                                <option value="spectral">Spectral</option>
                                <option value="spring">Spring</option>
                                <option value="summer">Summer</option>
                                <option value="winter">Winter</option>
                            </select>
                        </div>
                        <div id='layers-container'></div>
                    </div>
                    <div class='panel-title sub-panel'>Metadata</div>
                    <div id='metadata-viewer' class='sub-panel'></div>
                </div>
                <div id='grid-container'>
                    <div id='image-info'>Image: </div>
                    <div id="grid" class="container" oncontextmenu="return false" onmousedown="return false"></div>
                </div>
                <div id='database-browser'>
                    <div id='filters'>
                                    <label for='name'>Name</label>
                                    <input type='text' id='name'>
                                    <label for='modality'>Modality</label>
                                    <input type='text' id='modality'>
                                    <label for='subject'>Subject</label>
                                    <input type='text' id='subject'>
                                    <button id='submit-filters'>Submit Filters</button>
                                </div>
                    <div class='tab'>
                        <button class='tablink active'>Selected images</button>
                        <button class='tablink'>Image database</button>
                    </div>

                    <div id='selected-image-results'></div>
                    <div id='database-image-results'></div>
                </div>
            </div>
        </div>
        <!-- include libraries -->
        <script type="text/javascript" src="dist/cornerstone.js"></script>
        <script type="text/javascript" src="dist/cornerstoneMath.js"></script>
        <script type="text/javascript" src="dist/hammer.min.js"></script>
        <script type="text/javascript" src="dist/cornerstoneTools.js"></script>
        <script type="text/javascript" src="parsers/dicomParser.js"></script>
        <script type="text/javascript" src="imageLoaders/cornerstoneWADOImageLoader.js"></script>
        <script type="text/javascript" src="imageLoaders/cornerstoneWebImageLoader.js"></script>
        <script type="text/javascript" src="dist/simpleBar/simplebar.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>        

        <!-- define global variables -->
        <script type='module' src="utils/defineVariables.js"></script>

        <script>
            var chosen_id = 'jpg_string';
            var imageSeries = [];
            // imageSeries.push({
            //     series_id: 'timeSeries_image',
            //     baseURL: 'http://localhost:8000/test_RATIB2/RATIB2/heart_images',
            //     format: 'dcm',
            //     numFrames: 20,
            //     imgsPerFrame: 188,
            //     name: 'heart',
            //     modality: 'ecg',
            //     subject: 'a person'
            // });
            imageSeries.push({
                series_id: 'jpg_string',
                baseURL: 'http://localhost/image_viewer/test_jpg',
                format: 'jpg',
                numFrames: 1,
                imgsPerFrame: 2,
                name: 'test',
                modality: 'xray?',
                subject: 'unknown'
            });
            imageSeries.push({
                series_id: 'tiff_string',
                baseURL: 'http://localhost/image_viewer/test_tiff',
                format: 'tif',
                numFrames: 1,
                imgsPerFrame: 3,
                name: 'tiff_test',
                modality: 'none',
                subject: 'none'
            });
            var imageSeriesDict = imageSeries.reduce((accumulator, images, index) => {

                if (accumulator[images.series_id] !== undefined) {
                    console.warn('Image series ID has been repeated. Ignoring image series.');
                } else {
                    accumulator[images.series_id] = index;
                }

                return accumulator;
            }, {});

        </script>

        <!-- side scripts -->
        
        <script type='module' src='tools/chooseImageToAdd.js'></script>
        <script type="module" src="image_viewer.js"></script>
    </root>


</body>



</html>