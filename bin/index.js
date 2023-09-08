#! /usr/bin/env node

const { Config } = require('./config');
const { mkdir, writeFile } = require('node:fs/promises');
const { existsSync } = require('node:fs');

const args = process.argv.slice(2);

const DIR = process.cwd();

if (args.length < 1) {
  throw new Error('Workflow name must be specified.');
}

fetch(`${Config.BASE_URL}/${args[0]}.yml`).then(async (res) => {
  if (!res.ok && res.status === 404) {
    throw new Error('Defined workflow does not exists.');
  }

  const content = await res.text();

  const fileName = `${args[0].split('/')[1]}.yml`;

  try {
    if (!(await existsSync(`${DIR}/.github/workflows`))) {
      await mkdir(`${DIR}/.github/workflows`, { recursive: true });
    }

    await writeFile(`${DIR}/.github/workflows/${fileName}`, content);

    console.log('Done!');
  } catch (err) {
    throw err;
  }
});
