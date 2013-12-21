module.exports = {
  variants: {
    items: {
      // keepNames: true,
      resize: {
        mini : "300x200",
        preview: "800x600"
      },
      crop: {
        thumb: "200x200"
      },
      resizeAndCrop: {
        large: {resize: "1000x1000", crop: "900x900"}
      }
    },

    gallery: {
      rename: function (filename) {
        return 'MyFileManipulationLogic_' + filename;
      },
      crop: {
        thumb: "100x100"
      }
    }
  },

  storage: {
    Local: {
      path: "/var/www/"
    },
    Rackspace: {
      username: "USERNAME",
      apiKey: "API_KEY",
      authUrl: "https://lon.auth.api.rackspacecloud.com"
      container: "CONTAINER_NAME",
      region: "REGION_NAME"
    },
    S3: {
      key: 'API_KEY',
      secret: 'SECRET',
      bucket: 'BUCKET_NAME',
      storageClass: 'REDUCED_REDUNDANCY'
      // if your BUCKET_NAME contains dot(s) make sure you set `secure: false`
    },
    uploadDirectory: 'images/uploads/'
  },

  debug: true
}
