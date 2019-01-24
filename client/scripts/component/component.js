'use strict';

const fs = require('fs');
const files = require('./files');

const container = files.container;
const component = files.component;
const style = files.style;

const componentRegex = /^[^-].*/;
const pathRegex = /^--?p(ath)?=/;
const styleRegex = /^--?s(tyle)?=/;

/* eslint-disable */
const log = console.log;
const err = message => console.error('\x1b[41m%s\x1b[0m', message);
/* eslint-enable */

const args = process.argv.slice(2);

const hasHelpFlag = args.includes('-h') || args.includes('--help');

if (hasHelpFlag) {
  log(`
Usage: yarn component <ComponentName> [OPTIONS]

ComponentName:
    The name of the component to create. This will be appended to any path
    specified using the -p= option. For example, if the path is "src/components"
    and ComponentName is "Button" then the created component will be located at
    "src/components/Button" in your project.

    ComponentName can also be a path to create the component within a folder.
    For example, if ComponentName is "Common/Button" (and your path is still
    "src/components"), then you will create a component at
    "src/components/Common/Button".

OPTIONS:
    -c, --class        Create a class instead of functional component
    -r, --redux        Has Redux container file
    -h, --help         Open the help menu

    The following options should probably be specified in your package.json
    script to avoid re-typing for each component:

    -p='<Path>',       Specify the path to the component folder
    --path='<Path>'

    -s='<Prefix>',     A prefix for classNames in your components
    --style='<Prefix>'
`);
} else {
  const componentNamePath = args.find(arg => componentRegex.test(arg));
  const pathFlag = args.find(arg => pathRegex.test(arg));
  const styleFlag = args.find(arg => styleRegex.test(arg));

  const isClass = args.includes('-c') || args.includes('--class');
  const isRedux = args.includes('-r') || args.includes('--redux');

  let componentPath = '';
  let classNamePrefix = '';

  if (pathFlag) componentPath = pathFlag.split('=')[1];
  if (styleFlag) classNamePrefix = styleFlag.split('=')[1];

  if (!componentNamePath) {
    err('No component name specified. Must follow the following format:');
    err('yarn component <ComponentName> [OPTIONS]');
    err('Call `yarn component --help for more information`.');
  } else {
    const pathSegs = componentNamePath.split('/');
    const componentName = pathSegs.pop();
    const extendedPath = pathSegs.length ? `/${pathSegs.join('/')}` : '';

    const parentDir = `${componentPath}${extendedPath}`;
    const dir = `${parentDir}/${componentName}`;

    if (!fs.existsSync(parentDir)) {
      err(`Unable to find parent directory:`);
      err(parentDir);
    } else if (fs.existsSync(dir)) {
      err(`Component ${componentName} already exists.`);
    } else {
      // Make folder.
      fs.mkdirSync(dir);

      // Make container if is Redux.
      if (isRedux) {
        fs.writeFile(
          `${dir}/${componentName}Container.ts`,
          container(componentName, classNamePrefix),
          err => {
            if (err) {
              err('Error creating container.');
            } else {
              log('Container was created.');
            }
          },
        );
      }

      // Make component.
      fs.writeFile(
        `${dir}/${componentName}.tsx`,
        component(componentName, isClass, classNamePrefix),
        err => {
          if (err) {
            err('Error creating component.');
          } else {
            log('Component was created.');
          }
        },
      );

      // Make stylesheet.
      fs.writeFile(
        `${dir}/${componentName}.module.scss`,
        style(componentName, classNamePrefix),
        err => {
          if (err) {
            err('Error creating sass.');
          } else {
            log('Sass was created.');
          }
        },
      );
    }
  }
}
