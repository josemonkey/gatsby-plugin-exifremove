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

        const mockContent = 'test data';
        readFileMock.mockImplementation((_, callback) => {
            // Arguments are (error, data)
            callback(null, mockContent);
        });

        writeFileMock.mockImplementation((filename, data, callback) => {
            callback(null);

        });

    });

    afterEach(() => {
        // Clear the mock after each test to ensure test isolation
        jest.clearAllMocks();
    });

    it('onPostBuild processes files', async () => { // Mark the test as async

        const result = await gatsbyNode.onPostBuild(null, pluginOptions);

        expect(readFileMock).toHaveBeenCalledTimes(MOCK_JPEG_FILES.length);
        expect(removeMock).toHaveBeenCalledTimes(MOCK_JPEG_FILES.length);
        expect(writeFileMock).toHaveBeenCalledTimes(MOCK_JPEG_FILES.length);

    });

});
