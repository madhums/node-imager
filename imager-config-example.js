module.exports = {
  variants: {
    items: {
      // keepNames: true,
      resize: {
        mini : "300x200",
        preview: "800x600"
      },
      crop: {
        thumb: "200x200",
        // Sets the crop position, or "gravity". Default is NorthWest.
        // See http://www.graphicsmagick.org/GraphicsMagick.html#details-gravity for details
        thumb_center: "200x200 Center"
      },
      resizeAndCrop: {
        large: {resize: "1000x1000", crop: "900x900"}
      },
      thumbnail: {
        // "Cuts the thumbnail to fit"
        // See http://superuser.com/questions/275476/square-thumbnails-with-imagemagick-convert
        better_thumb: "100x100 NorthWest",
        better_thumb_center: "100x100 Center"
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
