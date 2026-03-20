const optionsValidation = require('../options-validation');
const Joi = require('joi');

const schema = optionsValidation.pluginOptionsSchema({Joi});

const completeOptionsExample = {
    debug: false,
    matchPattern: "**/*.{jpg,jpeg}",
    exifremoveConfig: {
        keepMarker: false,
        verbose: false
    },
};
const emptyOptions = {};

const invalidOptionsExampleBadPattern = {
    matchPattern: 100
};

const invalidOptionsExampleBadDebugValue = {
    debug: "not a boolean",
    matchPattern: "**/*.{jpg,jpeg}"
};

const invalidOptionsExampleBadExifRemValue = {
    exifremoveConfig: "not an object",
    matchPattern: "**/*.{jpg,jpeg}"
};

describe("schema test", () => {

    beforeAll(() => {
    });

    beforeEach(() => {

        jest.resetModules();

    });

    afterEach(() => {
        // Clear the mock after each test to ensure test isolation
        jest.clearAllMocks();
    });

    it('validates valid options', () => { 
        const { error, value } = schema.validate(completeOptionsExample);
        expect(error).toBe(undefined);
    });

    it('allows empty options', () => { 
        const { error, value } = schema.validate(emptyOptions);
        expect(error).toBe(undefined);
    });


    it('catches invalid options (bad pattern val)', () => { 
        const { error, value } = schema.validate(invalidOptionsExampleBadPattern);
        expect(error).not.toBe(undefined);
    });


    it('catches invalid options (bad debug val)', () => { 
        const { error, value } = schema.validate(invalidOptionsExampleBadDebugValue);
        expect(error).not.toBe(undefined);
    });

    it('catches invalid options (bad exifremoveConfig val)', () => { 
        const { error, value } = schema.validate(invalidOptionsExampleBadExifRemValue);
        expect(error).not.toBe(undefined);
    });

});
