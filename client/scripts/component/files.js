/*
 * This is a helper file for component.js. It provides the string content for
 * various component files.
 */

/**
 * Builds ComponentNameContainer.js
 * @param {string} componentName Name of component.
 */
const container = componentName =>
  `import { connect } from 'react-redux';
import Component from './${componentName}';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

const ${componentName} = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

export default ${componentName};
`;

/**
 * Builds ComponentName.jsx
 * @param {string} componentName Name of component.
 * @param {boolean} isClass Is component a class.
 * @param {string} classPrefix Prefix for class.
 */
const component = (componentName, isClass, classPrefix) =>
  !isClass
    ? `import React from 'react';

import s from './${componentName}.module.scss';

interface I${componentName}Props {
  someProp: string;
}

const ${componentName}: React.SFC<I${componentName}Props> = ({someProp}) => {
  return <div className={styles.something}>{'Hello World'}</div>;
}

export default ${componentName};
`
    : `import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './${componentName}.scss';

const propTypes = {};

const defaultProps = {};

class ${componentName} extends Component {
  state = {};

  render() {
    const {} = this.state;
    const {} = this.props;

    return <div className="${classPrefix}${componentName}">{'Hello World'}</div>;
  }
}

${componentName}.propTypes = propTypes;
${componentName}.defaultProps = defaultProps;
export default ${componentName};
`;

/**
 * Builds ComponentName.scss
 * @param {string} componentName Name of component.
 * @param {string} classPrefix Prefix for class.
 */
const style = () => ``;

module.exports = {
  container,
  component,
  style,
};
