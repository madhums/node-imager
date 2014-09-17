
// Checkout https://github.com/e-conomic/graphicsmagick-stream
// for preset options

exports.variants = {
  // variant
  item: {
    // preset
    thumb: {
      // preset options
      options: {
        pool: 5,
        scale: { width: 200, height: 150, type: 'contain' },
        crop: { width: 200, height: 150, x: 0, y: 0 },
        format: 'png',
        rotate: 'auto',
      },
      rename: function (file, preset) {
        return;
        // return 'users/1/' + preset + '/' + file.name;
      }
    },
    // preset
    large: {
      pool: 5,
      scale: { width: 800, height: 600, type: 'contain' },
      crop: { width: 800, height: 600, x: 0, y: 0 },
      format: 'png',
      rotate: 'auto'
    }
  }
};

exports.storages = {
  local: {
    provider: 'local',
    path: '/tmp',
    mode: 0777
  },
  rackspace: {
    provider: 'rackspace',
    username: process.env.IMAGER_RACKSPACE_USERNAME,
    apiKey: process.env.IMAGER_RACKSPACE_KEY,
    authUrl: 'https://lon.auth.api.rackspacecloud.com',
    container: process.env.IMAGER_RACKSPACE_CONTAINER
  },
  amazon: {
    provider: 'amazon',
    key: process.env.IMAGER_S3_KEY,
    keyId: process.env.IMAGER_S3_KEYID,
    container: process.env.IMAGER_S3_BUCKET
  }
}
