import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from '../../../../FlowHelpers/1.0.0/interfaces/interfaces';

const LANDSCAPE = 1;
const PORTRAIT = 2;
const SQUARE = 3;

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = (): IpluginDetails => ({
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
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = (args: IpluginInputArgs): IpluginOutputArgs => {
  const lib = require('../../../../../methods/lib')();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details);

  let outputNumber = LANDSCAPE;

  if (Array.isArray(args?.inputFileObj?.ffProbeData?.streams)) {
    for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i += 1) {
      const stream = args.inputFileObj.ffProbeData.streams[i];
      if (stream.codec_type === 'video') {
        if (!stream.height) {
          throw new Error('Cannot retrieve video height');
        } else if (!stream.width) {
          throw new Error('Cannot retrieve video width');
        } else if (stream.width === stream.height) {
          outputNumber = SQUARE;
        } else if (stream.width > stream.height) {
          outputNumber = LANDSCAPE;
        } else if (stream.width < stream.height) {
          outputNumber = PORTRAIT;
        }
      }
    }
  } else {
    throw new Error('File has no stream data');
  }

  return {
    outputFileObj: args.inputFileObj,
    outputNumber,
    variables: args.variables,
  };
};
export {
  details,
  plugin,
};
