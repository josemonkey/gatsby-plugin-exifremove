const fs = require('fs');
const util = require('util');
const glob = require('glob');
const exifRemove = require("exifremove");

const readFileAsync = util.promisify(fs.readFile);

async function onPostBuild(args, pluginOptions = {}) {

    const { reporter } = args;

    reporter.info(`Removing EXIF data from JPEG images.`);

    const pattern = `public/${pluginOptions.matchPattern}`;

    if (pluginOptions.debug) {
        reporter.info(`Looking for JPEG files with pattern '${pattern}'`);
    }
    const files = await glob.glob(pattern, { nodir: true });
    if (pluginOptions.debug) {
        reporter.info(`Files found: ${files.length}`);
    }

    if (pluginOptions.debug) {
        reporter.info(`Using exifremove options: ${JSON.stringify(pluginOptions.exifremoveConfig)}`);
    }

    const pluginStart = new Date().getTime();

    const processedFiles = files.map(async (file) => {

        if (pluginOptions.debug) {
            reporter.info(`Reading ${file}...`);
        }
        const data = await readFileAsync(file);

        return new Promise((resolve, reject) => {

            reporter.info(`Processing ${file}...`);

            let scrubbedImage;
            try {

                scrubbedImage = exifRemove.remove(data, {
                    keepMarker: pluginOptions.exifremoveConfig.keepMarker,
                    verbose: pluginOptions.exifremoveConfig.verbose
                });


            } catch (err) {
                reporter.error(`Error during run a EXIF removal at file ${file}`, err);
                reject();
            }

            fs.writeFile(file, scrubbedImage, (err) => {
                if (pluginOptions.debug) {
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