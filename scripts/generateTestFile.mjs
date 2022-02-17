import chalk from 'chalk';
import glob from 'glob';
import vm from 'vm';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, relative, win32 } from 'path';

// const code = `module.exports = a`
// const context = vm.createContext({ a: 1 })
// const res = vm.runInContext(`const module = {exports: {}};\n${code}`, context);
// console.log(res);

const root = dirname(fileURLToPath(import.meta.url));

const getFiles = async() => {
  glob("demo/**/*.js", {}, function (er, files) {
    // console.log(files)
    console.log(win32);
    files.forEach(f => {
      const p = resolve(root, f);
      console.log('path', p);
    })
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
  })
}

getFiles();