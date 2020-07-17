try {
  var config = {
    config: {
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand : true,
    },
  };

  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
} catch(error) {
  throw new Error('Unable to load WADO');
}