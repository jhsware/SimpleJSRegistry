import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';

const baseConfig = (outputFormat) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let file;
  switch (outputFormat) {
    case 'umd':
    case 'cjs':
      file = 'dist/' + outputFormat + '/index' + (isProduction ? '.min' : '') + '.js';
      break;

    default:
      throw new Error('Unsupported output format: ' + outputFormat);
  }

  return {
    input: 'src/index.js',
    plugins: [
      nodeResolve(),
      babel({
        plugins: [
          // Ensure "external-helpers" is only included in rollup builds
          // Issue: https://github.com/rollup/rollup/issues/1595
          'external-helpers',
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      isProduction ? minify({
        comments: false,
      }) : false,
    ],
    external: [
      'uuid'
    ],
    output: {
      name: 'ComponentRegistry',
      file: file,
      format: outputFormat,
      sourcemap: true,
      globals: {
        'uuid': 'uuid'
      },
    },
  };
};

export default [
  baseConfig('cjs'),
  baseConfig('umd'),
];