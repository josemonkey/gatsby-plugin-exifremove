const fs = require('fs');
const readFileMock = jest.spyOn(fs, 'readFile');
const writeFileMock = jest.spyOn(fs, 'writeFile');

const exifremove = require('exifremove');

jest.mock('exifremove');
const removeMock = jest.spyOn(exifremove, 'remove');

const glob = require('glob');

const gatsbyNode = require("../gatsby-node");

const MOCK_JPEG_FILES = [
    'file1.jpg',
    'file2.jpg',
    'file3-longer1213131.jpg',
    'another_file.jpeg',
];


const mockImageData = 'This is image data with EXIF embedded.';
const mockScrubbedImageData = 'This is image data WITHOUT ANY EXIF embedded!';

const pluginOptions = {
    debug: false,
    matchPattern: "**/*.{jpg,jpeg}",
    exifremoveConfig: {
        keepMarker: false,
        verbose: false
    },
};

describe("plugin", () => {

    beforeAll(() => {
    });

    beforeEach(() => {

        jest.resetModules();

        glob.__setMockFiles(MOCK_JPEG_FILES);

        readFileMock.mockImplementation((_, callback) => {
            // Arguments are (error, data)
            callback(null, mockImageData);
        });

        writeFileMock.mockImplementation((filename, data, callback) => {
            callback(null);

        });

        removeMock.mockImplementation((data, options) => {
            return mockScrubbedImageData;

        });

    });

    afterEach(() => {
        // Clear the mock after each test to ensure test isolation
        jest.clearAllMocks();
    });

    it('onPostBuild processes files', async () => { // Mark the test as async

        const args = {
            reporter: {
                info(message) {
                    // noop
                },
                warn(message) {
                    console.warn(message);
                },
                error(message, err) {
                    console.error(message, err);
                }
            },
        };
        const result = await gatsbyNode.onPostBuild(args, pluginOptions);

        expect(readFileMock).toHaveBeenCalledTimes(MOCK_JPEG_FILES.length);
        expect(removeMock).toHaveBeenCalledTimes(MOCK_JPEG_FILES.length);
        expect(writeFileMock).toHaveBeenCalledTimes(MOCK_JPEG_FILES.length);

        MOCK_JPEG_FILES.forEach((mockFilename, index) => {

            expect(readFileMock).toHaveBeenNthCalledWith(index + 1, mockFilename, expect.any(Function));
            expect(removeMock).toHaveBeenNthCalledWith(index + 1, mockImageData, pluginOptions.exifremoveConfig);
            expect(writeFileMock).toHaveBeenNthCalledWith(index + 1, mockFilename, mockScrubbedImageData, expect.any(Function));

        });

    });

});
