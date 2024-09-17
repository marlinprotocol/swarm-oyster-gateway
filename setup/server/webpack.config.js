const path = require('path')

module.exports = {
  entry: './dist/app.js', // adjust this path if necessary
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  mode: 'production',
}
