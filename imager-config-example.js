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
      storageClass: 'REDUCED_REDUNDANCY',
      secure: false, // (optional) if your BUCKET_NAME contains dot(s), set this to false. Default is `true`
      cdn: 'CDN_URL' // (optional) if you want to use Amazon cloudfront cdn, enter the cdn url here
    },
    uploadDirectory: 'images/uploads/'
  },

  debug: true
}
