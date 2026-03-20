'use strict';

const exifRemovePlugin = require('./exifremove-plugin');
const optionsValidation = require('./options-validation');

exports.onPostBuild = exifRemovePlugin.onPostBuild;
exports.pluginOptionsSchema = optionsValidation.pluginOptionsSchema;
