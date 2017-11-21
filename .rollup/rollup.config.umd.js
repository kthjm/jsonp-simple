import flow from 'rollup-plugin-flow'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  plugins: [flow({ pretty: true }), babel(), uglify({}, minify)],
  output: {
    format: 'umd',
    file: './dist/jsonp-simple.min.js',
    name: 'jsonpSimple'
  }
}
