const fs = require('fs');
const util = require('util');
const glob = require('glob');
const {isObject, isBoolean, deepMerge} = require('./helpers');


const readFileAsync = util.promisify(fs.readFile);

const defaultOptions = {
    debug: true,
    config: {
        dryRun: false,
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

        console.info(`Reading file ${file}`);
        const data = await readFileAsync(file);
        return new Promise((resolve, reject) => {
            let scrubbedImage;
            try {
                // TODO: Do something 
                scrubbedImage = data;
            } catch (err) {
                console.warn(`Error during run a EXIF removal at file ${file}:\n\n${err}`);
            }
            const reduced = (((data.length - scrubbedImage.length) / data.length) * 100).toFixed(2);

            if (!options.dryRun) {
                console.info(`Writing file ${file}`);
                fs.writeFile(file, scrubbedImage, (err) => {
                    if (err) {
                        reject();
                        console.error(`EXIF removal error on write file:\n\n${err}`);
                    }
                    options.debug ? console.debug(file, `> reduced ${reduced}%.`) : '';
                    resolve();
                });
            }

        });
    });
    await Promise.all(processedFiles);

    const pluginEnd = new Date().getTime();
    console.info(`EXIF removal done in ${(pluginEnd - pluginStart) / 1000} sec`);
}

exports.onPostBuild = onPostBuild;