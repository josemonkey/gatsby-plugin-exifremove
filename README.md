# gatsby-plugin-exifremove

[![Issues](https://img.shields.io/github/issues-raw/josemonkey/gatsby-plugin-exifremove)](https://github.com/josemonkey/gatsby-plugin-exifremove)

**A Gatsby plugin for **removing EXIF data from JPEG files at build time.**

With this plugin, you can strip the EXIF data out of every JPEG file (`.jpg` or `.jpeg`) in the `public` directory of your gatsby project at build time.

_NOTE: This plugin only processes images when run in `production` mode! To test it against your images, run: `gatsby build && gatsby serve`._

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
    - [exifremove Configration](#exifremove-configuration)
    - [Example](#example)
- [License](#license)

## Installation

Install with yarn:

```sh
yarn add gatsby-plugin-exifremove
```

Or install with npm:

```sh
npm install --save gatsby-plugin-exifremove
```

## Usage

After installing `gatsby-plugin-exifremove` you need to add it to the `plugins` array in your `gatsby-config.js` file:

```js
module.exports = {
  plugins: ['gatsby-plugin-exifremove']
};
```


### Options

This plugin takes the following options:

| Name                  | Type      | Default               | Description                                                                                                                         |
| :-------------------: | :-------: | :-------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
| `debug`               | `boolean` | `false`               | Tells the plugin to generate debug output.                                                                                          |
| `matchPattern`        | `string`  | `"**/*.{jpg,jpeg}"`   | The pattern to use when searching for files under the `public` folder. The string `'public/'` will be added to this as a prefix.    |
| `exifremove-config`   | `Object`  | (See below)           | Configuration options to pass to exifremove. See below.

#### exifremove Configration

This plugin uses [`exifremove`](https://github.com/Coteh/exifremove) under the covers. To pass options to `exifremove`, add them to the `exifremoveConfig: { }` object in your `gatsby-config.js` entry.

The default configuration options are:

|   Name        |   Type    | Default       | Description                                                   |
| :-----------: | :-------: | :-----------: | :-----------------------------------------------------------: |
| `verbose`     | `boolean` | `false`       | Tells exifremove to print verbose messages                    |
| `keepMarker`  | `boolean` | `false`       | Tells exifremove to keeps the APP1 marker in the JPEG         |


#### Example

`gatsby-config.js`

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-exifremove',
      options: {
        debug: true, // debug optional, default false
        matchPattern: "**/*.{jpg,jpeg}" // optional, this is the default value
        exifremoveConfig: {
          verbose: false,
          keepMarker: false,
        }
      }
    }
  ]
};
```

## Credits

### gatsby-plugin-minify-html

This plugin is modeled after [gatsby-plugin-minify-html](https://github.com/illvart/gatsby-plugin-minify-html) and borrows significantly from that project.

### exifremove 

This plugin uses [`exifremove`](https://github.com/Coteh/exifremove) under the covers to process the JPEG files.

## License

Licensed under [MIT](./LICENSE).