#!/usr/bin/env node
import { buildClient, watchClient } from '../src/scripts/compile'

const { Command } = require('commander');

const program = new Command();

process.env._WORKSPACE_ = process.cwd();

program
  .name('ntr')
  .usage('[command] [options] ')
  .option('-w', '--watch', '【build参数】watch前端资源')
  .description('nestjs tsx render')

program
  .command('build')
  .description('打包资源')
  .option('-w, --watch', 'watch前端资源')
  .action(async () => {
    const options = program.opts();
    if(options['w']) {
      watchClient()
    } else {
      buildClient()
    }
  });

program.parse(process.argv);
