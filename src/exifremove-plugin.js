const fs = require('fs');
const util = require('util');
const glob = require('glob');
const exifRemove = require("exifremove");

const { isObject, isBoolean, deepMerge } = require('./helpers');

const readFileAsync = util.promisify(fs.readFile);

const defaultOptions = {
    debug: false,
    config: {
        keepMarker: false,
        verbose: false
    },
};


async function onPostBuild(args, pluginOptions = {}) {

    if (pluginOptions) {
        if (pluginOptions.debug && !isBoolean(pluginOptions.debug)) {
            throw new Error('EXIF remove error, at plugin options `debug` value not type boolean false or true.');
        }
        if (pluginOptions.config && !isObject(pluginOptions.config)) {
            throw new Error('EXIF remove error, at plugin options `config` value not type object.');
        }
    }
    const options = deepMerge(defaultOptions, pluginOptions);

    const pattern = 'public/**/*.{jpg,jpeg}';
    const files = await glob.glob(pattern, { nodir: true });

    const pluginStart = new Date().getTime();
    const allFilesString = `Removing EXIF data from JPEG images in public directory; total files found: ${files.length}`;
    console.info(options.debug ? `${allFilesString}:` : `${allFilesString}.`);

    const processedFiles = files.map(async (file) => {

        const data = await readFileAsync(file);
        return new Promise((resolve, reject) => {

            console.info(`Processing ${file}...`);

            let scrubbedImage;
            try {
                if (options.verbose) {
                    console.log(`Image file length: ${data.length}`);
                }

                scrubbedImage = exifRemove.remove(data, {
                    keepMarker: options.keepMarker,
                    verbose: options.verbose
                });


            } catch (err) {
                console.error(`Error during run a EXIF removal at file ${file}:\n\n${err}`);
                reject();
            }

            fs.writeFile(file, scrubbedImage, (err) => {
                if (err) {
                    reject();
                    console.error(`EXIF removal error on write file:\n\n${err}`);
                }
                resolve();
            });
            

        });
    });
    await Promise.all(processedFiles);

    const pluginEnd = new Date().getTime();
    console.info(`EXIF removal done in ${(pluginEnd - pluginStart) / 1000} sec`);
}

exports.onPostBuild = onPostBuild;