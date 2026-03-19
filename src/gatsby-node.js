'use strict';

const exifRemovePlugin = require('./exifremove-plugin');

exports.onPostBuild = exifRemovePlugin.onPostBuild;