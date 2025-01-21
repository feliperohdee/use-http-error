import util from './util';

namespace ErrorStackParser {
	export interface StackFrame {
		columnNumber: number;
		fileName: string;
		functionName: string;
		lineNumber: number;
	}
}

const errorStackParser = (error: Error): ErrorStackParser.StackFrame[] => {
	const stack = error.stack || '';
	const stackFrames = stack.split('\n').slice(1); // Remove the first line which is the error message

	return stackFrames
		.map(frame => {
			const match = frame.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || frame.match(/at\s+(.*):(\d+):(\d+)/);

			if (match) {
				const functionName = match[1] || '<anonymous>';
				const fileName = match[2];
				const lineNumber = util.toNumber(match[3]);
				const columnNumber = util.toNumber(match[4]);

				return {
					functionName,
					fileName,
					lineNumber,
					columnNumber
				};
			}

			return {
				functionName: '<unknown>',
				fileName: '<unknown>',
				lineNumber: 0,
				columnNumber: 0
			};
		})
		.slice(0, 3);
};

export { ErrorStackParser };
export default errorStackParser;
