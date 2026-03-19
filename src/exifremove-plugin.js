const fs = require('fs');
const util = require('util');
const glob = require('glob');
const exifRemove = require("exifremove");

const { isObject, isBoolean, isString, deepMerge } = require('./helpers');

const pluginName = 'gatsby-plugin-exifremove';

const readFileAsync = util.promisify(fs.readFile);

const defaultOptions = {
    debug: false,
    matchPattern: "**/*.{jpg,jpeg}",
    exifremoveConfig: {
        keepMarker: false,
        verbose: false
    },
};


async function onPostBuild(args, pluginOptions = {}) {

    const { reporter } = args;

    if (pluginOptions) {
        if (pluginOptions.debug && !isBoolean(pluginOptions.debug)) {
            throw new Error(`${pluginName} error reading options: 'debug' value not a valid boolean value.`);
        }
        if (pluginOptions.matchPattern && !isString(pluginOptions.matchPattern)) {
            throw new Error(`${pluginName} error reading options: 'matchPattern' value not a string.`);
        }
        if (pluginOptions.exifremoveConfig && !isObject(pluginOptions.exifremoveConfig)) {
            throw new Error(`${pluginName} error reading options: 'exifremoveConfig' value not an object.`);
        }
    }
    const options = deepMerge(defaultOptions, pluginOptions);

    reporter.info(`Removing EXIF data from JPEG images.`);

    const pattern = `public/${options.matchPattern}`;

    if (options.debug) {
        reporter.info(`Looking for JPEG files with pattern '${pattern}'`);
    }
    const files = await glob.glob(pattern, { nodir: true });
    if (options.debug) {
        reporter.info(`Files found: ${files.length}`);
    }

    if (options.debug) {
        reporter.info(`Using exifremove options: ${JSON.stringify(options.exifremoveConfig)}`);
    }

    const pluginStart = new Date().getTime();

    const processedFiles = files.map(async (file) => {

        if (options.debug) {
            reporter.info(`Reading ${file}...`);
        }
        const data = await readFileAsync(file);

        return new Promise((resolve, reject) => {

            reporter.info(`Processing ${file}...`);

            let scrubbedImage;
            try {

                scrubbedImage = exifRemove.remove(data, {
                    keepMarker: options.exifremoveConfig.keepMarker,
                    verbose: options.exifremoveConfig.verbose
                });


            } catch (err) {
                reporter.error(`Error during run a EXIF removal at file ${file}`, err);
                reject();
            }

            fs.writeFile(file, scrubbedImage, (err) => {
                if (options.debug) {
                    reporter.info(`Writing ${file}...`);
                }
                if (err) {
                    reject();
                    reporter.error(`EXIF removal error on write file`, err);
                }
                resolve();
            });


        });
    });
    await Promise.all(processedFiles);

    const pluginEnd = new Date().getTime();
    reporter.info(`EXIF removal done in ${(pluginEnd - pluginStart) / 1000} sec`);
}

exports.onPostBuild = onPostBuild;