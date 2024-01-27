// https://github.com/marvinhagemeister/kolorist/blob/a8fabdc6c8fdb8e87d41239e68708dbde7539496/src/index.ts

// The MIT License (MIT)

// Copyright (c) 2020-present Marvin Hagemeister

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Changes made:
//  - removed rgbToAnsi256, ansi256, ansi256Bg, trueColor, trueColorBg
//  - set globalVar to just global

let enabled = true;

// Support both browser and node environments
const globalVar = global;
	// typeof self !== 'undefined'
	// 	? self
	// 	: typeof window !== 'undefined'
	// 	? window
	// 	: typeof global !== 'undefined'
	// 	? global
	// 	: ({} as any);

export const enum SupportLevel {
	none,
	ansi,
	ansi256,
	trueColor,
}

/**
 * Detect how much colors the current terminal supports
 */
let supportLevel: SupportLevel = SupportLevel.none;

if (globalVar.process && globalVar.process.env && globalVar.process.stdout) {
	const { FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, COLORTERM } =
		globalVar.process.env;
	if (NODE_DISABLE_COLORS || NO_COLOR || FORCE_COLOR === '0') {
		enabled = false;
	} else if (
		FORCE_COLOR === '1' ||
		FORCE_COLOR === '2' ||
		FORCE_COLOR === '3'
	) {
		enabled = true;
	} else if (TERM === 'dumb') {
		enabled = false;
	} else if (
		'CI' in globalVar.process.env &&
		[
			'TRAVIS',
			'CIRCLECI',
			'APPVEYOR',
			'GITLAB_CI',
			'GITHUB_ACTIONS',
			'BUILDKITE',
			'DRONE',
		].some(vendor => vendor in globalVar.process.env)
	) {
		enabled = true;
	} else {
		enabled = process.stdout.isTTY;
	}

	if (enabled) {
		// Windows supports 24bit True Colors since Windows 10 revision #14931,
		// see https://devblogs.microsoft.com/commandline/24-bit-color-in-the-windows-console/
		if (process.platform === 'win32') {
			supportLevel = SupportLevel.trueColor;
		} else {
			if (COLORTERM && (COLORTERM === 'truecolor' || COLORTERM === '24bit')) {
				supportLevel = SupportLevel.trueColor;
			} else if (TERM && (TERM.endsWith('-256color') || TERM.endsWith('256'))) {
				supportLevel = SupportLevel.ansi256;
			} else {
				supportLevel = SupportLevel.ansi;
			}
		}
	}
}

export let options = {
	enabled,
	supportLevel,
};

function kolorist(
	start: number | string,
	end: number | string,
	level: SupportLevel = SupportLevel.ansi
) {
	const open = `\x1b[${start}m`;
	const close = `\x1b[${end}m`;

	return (str: string) => {
		return options.enabled && options.supportLevel >= level
			? open + str + close
			: str;
	};
}

export function stripColors(str: string | number) {
	return ('' + str)
		.replace(/\x1b\[[0-9;]+m/g, '')
		.replace(/\x1b\]8;;.*?\x07(.*?)\x1b\]8;;\x07/g, (_, group) => group);
}

// modifiers
export const reset = kolorist(0, 0);
export const bold = kolorist(1, 22);
export const dim = kolorist(2, 22);
export const italic = kolorist(3, 23);
export const underline = kolorist(4, 24);
export const inverse = kolorist(7, 27);
export const hidden = kolorist(8, 28);
export const strikethrough = kolorist(9, 29);

// colors
export const black = kolorist(30, 39);
export const red = kolorist(31, 39);
export const green = kolorist(32, 39);
export const yellow = kolorist(33, 39);
export const blue = kolorist(34, 39);
export const magenta = kolorist(35, 39);
export const cyan = kolorist(36, 39);
export const white = kolorist(97, 39);
export const gray = kolorist(90, 39);

export const lightGray = kolorist(37, 39);
export const lightRed = kolorist(91, 39);
export const lightGreen = kolorist(92, 39);
export const lightYellow = kolorist(93, 39);
export const lightBlue = kolorist(94, 39);
export const lightMagenta = kolorist(95, 39);
export const lightCyan = kolorist(96, 39);

// background colors
export const bgBlack = kolorist(40, 49);
export const bgRed = kolorist(41, 49);
export const bgGreen = kolorist(42, 49);
export const bgYellow = kolorist(43, 49);
export const bgBlue = kolorist(44, 49);
export const bgMagenta = kolorist(45, 49);
export const bgCyan = kolorist(46, 49);
export const bgWhite = kolorist(107, 49);
export const bgGray = kolorist(100, 49);

export const bgLightRed = kolorist(101, 49);
export const bgLightGreen = kolorist(102, 49);
export const bgLightYellow = kolorist(103, 49);
export const bgLightBlue = kolorist(104, 49);
export const bgLightMagenta = kolorist(105, 49);
export const bgLightCyan = kolorist(106, 49);
export const bgLightGray = kolorist(47, 49);

// Links
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

export function link(text: string, url: string) {
	return options.enabled
		? OSC + '8' + SEP + SEP + url + BEL + text + OSC + '8' + SEP + SEP + BEL
		: `${text} (\u200B${url}\u200B)`;
}