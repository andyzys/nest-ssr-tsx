#!/usr/bin/env node
import { buildClient } from '../src/scripts/compile'

const { Command } = require('commander');

const program = new Command();

process.env._WORKSPACE_ = process.cwd();

program
  .name('ntr')
  .usage('[command] [options] ')
  .description('nestjs tsx render')

program
  .command('build')
  .description('打包资源')
  .option('-f, --frontend', '前端资源')
  .action(async () => {
    // const options = program.opts();
    buildClient()
  });

program.parse(process.argv);
