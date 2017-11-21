import flow from 'rollup-plugin-flow'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  plugins: [flow({ pretty: true }), babel()],
  output: {
    format: 'es',
    file: './dist/jsonp-simple.es.js'
  }
}
