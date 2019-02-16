/// <reference types="react-scripts" />

// Declare css-modules.
declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}
