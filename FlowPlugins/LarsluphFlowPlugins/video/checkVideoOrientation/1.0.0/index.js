"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var LANDSCAPE = 1;
var PORTRAIT = 2;
var SQUARE = 3;
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () { return ({
    name: 'Check Video Orientation',
    description: 'Check if video is portait, landscape or square',
    style: {
        borderColor: 'orange',
    },
    tags: 'video',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: 'faQuestion',
    inputs: [],
    outputs: [
        {
            number: LANDSCAPE,
            tooltip: 'Video is landscape',
        },
        {
            number: PORTRAIT,
            tooltip: 'Video is portrait',
        },
        {
            number: SQUARE,
            tooltip: 'Video is square',
        },
    ],
}); };
exports.details = details;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var _a, _b;
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    var outputNumber = LANDSCAPE;
    if (Array.isArray((_b = (_a = args === null || args === void 0 ? void 0 : args.inputFileObj) === null || _a === void 0 ? void 0 : _a.ffProbeData) === null || _b === void 0 ? void 0 : _b.streams)) {
        for (var i = 0; i < args.inputFileObj.ffProbeData.streams.length; i += 1) {
            var stream = args.inputFileObj.ffProbeData.streams[i];
            if (stream.codec_type === 'video') {
                if (!stream.height) {
                    throw new Error('Cannot retrieve video height');
                }
                else if (!stream.width) {
                    throw new Error('Cannot retrieve video width');
                }
                else if (stream.width === stream.height) {
                    outputNumber = SQUARE;
                }
                else if (stream.width > stream.height) {
                    outputNumber = LANDSCAPE;
                }
                else if (stream.width < stream.height) {
                    outputNumber = PORTRAIT;
                }
            }
        }
    }
    else {
        throw new Error('File has no stream data');
    }
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: outputNumber,
        variables: args.variables,
    };
};
exports.plugin = plugin;
