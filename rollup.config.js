import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/Hooks/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'es',
      sourcemap: true,
      strict: true
    }
  ],
  plugins: [
    nodeResolve(),
    typescript(),
    commonjs({
      namedExports: {
        'react-js': ['isValidElementType']
      }
    })
  ],
  external: ['react', 'react-dom']
};
