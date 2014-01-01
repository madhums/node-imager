
0.2.3 / 2014-01-01
=================

  * Support cloudfront cdn. Add `cdn` config for s3 uploads

0.2.2 / 2013-12-31
=================

  * Fix cdnUri for S3 uploads

0.2.1 / 2013-12-25
=================

  * Add custom rename method for files in the imager config

0.2.0 / 2013-11-14
==================

  * Updated dependencies
  * Use pkgcloud instead of cloudfiles
  * Added `keepNames` config to retain names of the images
  * Updated examples
  * Added express example
  * Added more tests

0.1.12 / 2013-09-17
==================

  * Recent changes to express makes content type to be present in file.headers['content-type'] rather file['type']. Also should make sure to support file uploads from local files.

0.1.11 / 2013-09-10
==================

  * Only send x-amz-storage-class header if storageClass is set in config

0.1.10 / 2013-04-22
==================

  * "x-amz-storage-class" added to use cheaper S3 hosting if needed
  * Added upload to folder option
  * Added functionality to choose a folder within the bucket to which the images are uploaded

0.1.9 / 2013-04-22
==================

  * Set the default ACL to 'public-read' for files uploaded to Amazon
  * add tests
  * add travis ci
  * refactor imager for better error handling and flexible syntax
  * remove makefile, add mocha to npm test
  * update node engine support - os.tmpDir works only > 0.8.x

0.1.8 / 2013-04-21
==================

  * update dependencies
  * add missing comma - bug fix
  * Merge pull request #23 from rubenstolk/patch-3
  * Can't declare a variable that already exists in context
  * Merge pull request #22 from rubenstolk/patch-2
  * Support for both image/jpg and image/jpeg as content type

0.1.7 / 2013-04-20
==================

  * refactor. fixes #21
  * Merge pull request #20 from frekw/master
  * Bump knox to 0.7 to add support for regions other than US and putFile.
  * Make sure we don't end up with double trailing slashes. We should also respect the platforms directory separator.
  * Merge pull request #14 from danielmahon/patch-1
  * needs to be array
  * update readme

0.1.6 / 2013-03-06
==================

  * add missing trailing / for temp directory
  * use temp directory of the OS

0.1.5 / 2013-02-18
==================

  * use proper logging
  * remove files after successful upload
  * refactor code
  * update readme

0.1.4 / 2012-11-06
==================

  * bump
  * add auto-orient option
  * update readme

0.1.3 / 2012-09-26
==================

  * add S3 upload and remove functionality
  * update example config with s3 storage
  * add knox for S3 support

0.1.2 / 2012-09-09
==================

  * add resizeAndCrop preset to the test
  * remove unwanted files
  * remove resizeAndCropped files
  * prepare release 0.1.1

0.1.1 / 2012-09-08
==================

  * update the example
  * add resize and crop option
  * tests for upload and remove
  * add test imager config
  * update readme
  * allow string to be passed to remove
  * add debug option to display uploaded images

0.1.0 / 2012-08-24
==================

  * allow uploading of local files
  * bug fix in returning array of files
  * add license
  * update readme

0.0.9 / 2012-08-10
==================

  * update readme
  * make remove fn to use the default variant when no variant is provided
  * support default variant
  * add debugging options
  * replace imagemagick with graphicsmagick
  * remove imagemagick and add graphicsmagick
  * add back remove functionality
  * revert node version dependency
  * remove logs
  * prepare release 0.0.9
  * imager config example
  * use async #7 and completely rewrite the module
  * add async and underscore
  * using async

0.0.8 / 2012-08-04
==================

  * Merge branch 'master' of github.com:madhums/node-imager
  * return if error
  * Merge pull request #6 from node-migrator-bot/clean
  * [fix] path.existsSync was moved to fs.existsSync
  * ignore leaks for mocha tests
  * fixtures
  * tests for single, multiple and remote image uploads
  * include async
  * ignore npm-debug.log
  * add dev dependencies and scripts to run npm test
  * continue processing, don't return the err

0.0.7 / 2012-06-03
==================

  * fixs #5
  * return if error
  * update readme

0.0.6 / 2012-05-29
==================

  * update documentation
  * bug fixes, add feature to upload remote images
  * fixes #1, #2, #3

0.0.5 / 2012-04-24
==================

  * support local file uploads #3, support multiple file uploads #4
  * rename repo

0.0.4 / 2012-03-04
==================

  * add functionality to remove files, other control flow changes
  * change scope from projects to items
  * update readme
  * change description
  * reduce the usage of eval

0.0.3 / 2012-03-04
==================

  * prettify code - formatting, indentation
  * indent properly
  * update readme
  * fix markdown
  * replace tabs by spaces
  * update readme

0.0.2 / 2012-03-04
==================

  * bug fixes and other changes
  * update readme
  * add node_modules to .gitignore

0.0.1 / 2012-03-04
==================

  * update readme
  * update readme
  * update readme
  * initial commit
