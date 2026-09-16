#!/usr/bin/env node
import path from 'node:path';
import url from 'node:url';

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import findUp from 'find-up';

import playroomFactory from '../lib/index.mts';
import type { PlayroomConfig } from '../utils/index.ts';

const showUsage = () => {
  console.log(
    commandLineUsage([
      {
        header: 'playroom',
        content:
          'Code-oriented component design tool.\n\nUsage: playroom <command> [options...]',
      },
      {
        header: 'Commands',
        content: [
          { name: 'start', summary: 'Start a local playroom.' },
          {
            name: 'build',
            summary: 'Build a playroom for production.',
          },
          { name: 'help', summary: 'Show this usage guide.' },
        ],
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'config',
            typeLabel: '{underline path}',
            description: 'Path to a config file.',
          },
        ],
      },
    ]),
  );
};

const args = commandLineArgs([
  { name: 'command', defaultOption: true, defaultValue: 'start' },
  { name: 'config' },
  { name: 'help', type: Boolean },
]);

if (args.command === 'help' || args.help) {
  showUsage();
}

const cwd = process.cwd();
const configPath = args.config
  ? path.resolve(cwd, args.config)
  : await findUp(
      ['playroom.config.js', 'playroom.config.mjs', 'playroom.config.cjs'],
      { cwd },
    );

if (!configPath) {
  console.error('Please add a playroom.config.js to the root of your project.');
  process.exit(1);
}

const { default: config } = (await import(
  url.pathToFileURL(configPath).href
)) as { default: PlayroomConfig };

const playroom = playroomFactory({
  cwd: path.dirname(configPath),
  ...config,
});

if (args.command === 'start' || args.command === 'build') {
  const command: 'start' | 'build' = args.command;
  playroom[command]((err?: string) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
} else {
  showUsage();
  process.exit(1);
}
