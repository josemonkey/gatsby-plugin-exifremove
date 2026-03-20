const pluginOptionsSchema = ({ Joi }) =>
    Joi.object({
        debug: Joi.boolean().default(false),
        matchPattern: Joi.string().default("**/*.{jpg,jpeg}"),
        exifremoveConfig: Joi.object().default({
            keepMarker: false,
            verbose: false
        })
    });

exports.pluginOptionsSchema = pluginOptionsSchema;