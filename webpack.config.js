module.exports = {
    context: __dirname + '/app',
    entry: './entry',
    output: {
      path: __dirname + '/public/javascripts',
      filename: 'bundle.js'
    },
    mode: 'none',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
            // cssの拡張子のみ
            test: /\.css$/,
            // ファイルの読み込みとコンパイル
            use: [
                "style-loader",
                "css-loader"
            ],
        },
      ],
    },
  };