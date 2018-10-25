#!/usr/bin/env node
const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const webpack = require('webpack');
const findUp = require('find-up');
const lib = require('../lib');

const showUsage = () => {
  console.log(
    commandLineUsage([
      {
        header: 'playroom',
        content:
          'Code-oriented component design tool.\n\nUsage: playroom <command> [options...]'
      },
      {
        header: 'Commands',
        content: [
          { name: 'start', summary: 'Start a local playroom.' },
          {
            name: 'build',
            summary: 'Build a playroom for production.'
          },
          { name: 'help', summary: 'Show this usage guide.' }
        ]
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'config',
            typeLabel: '{underline path}',
            description: 'Path to a config file.'
          }
        ]
      }
    ])
  );
};

(async () => {
  const args = commandLineArgs([
    { name: 'command', defaultOption: true, defaultValue: 'start' },
    { name: 'config' },
    { name: 'help', type: Boolean }
  ]);

  if (args.command === 'help' || args.help) {
    return showUsage();
  }

  const cwd = process.cwd();
  const configPath = args.config
    ? path.resolve(cwd, args.config)
    : await findUp('playroom.config.js', { cwd });

  const config = require(configPath);

  const playroom = lib({
    cwd: path.dirname(configPath),
    ...config
  });

  if (playroom.hasOwnProperty(args.command)) {
    playroom[args.command](err => {
      if (err) {
        process.exit(1);
      }
    });
  } else {
    showUsage();
    process.exit(1);
  }
})();
