
module.exports = {
  variants: {
    items: {
      rename: function (filename) {
        return Date.now() + '_' + filename;
      },
      thumbnail: {
        mini_thumb_center: "160x160",
        medium_thumb_center: "360x360",
        mini_thumb: "160x160 NorthWest",
        medium_thumb: "360x360 NorthWest"
      },
      resize: {
        original : "100%",
        mini : "160x160",
        medium : "360x360",
        large : "640x640"
      },
      resizeAndCrop: {
        // mini_thumb : {crop: "160x160", resize: "480x480"},
        // medium_thumb : {crop: "360x360", resize: "1080x1080"}
      }
    },

    gallery: {
      rename: function (filename) {
        return 'MyFilenameManipulation_' + filename;
      },
      crop: {
        thumb: "100x100"
      }
    }
  },

  storage: {
    Local: {
      path: '/tmp',
      mode: 0777
    },
    Rackspace: {
      username: "USERNAME",
      apiKey: "API_KEY",
      authUrl: "https://lon.auth.api.rackspacecloud.com",
      container: "CONTAINER_NAME"
    },
    S3: {
      key: 'KEY',
      secret: 'SECRET',
      bucket: 'BUCKET'
      // set `secure: false` if you want to use buckets with characters like .
    }
  },

  debug: false
}
