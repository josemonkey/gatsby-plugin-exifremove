'use strict';

const exifRemovePlugin = require('./src/exifremove-plugin');

exports.onPostBuild = exifRemovePlugin.onPostBuild;