let mix = require('laravel-mix');

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.ya?ml$/,
                type: 'json',
                use: 'yaml-loader'
            }
        ]
    }
});

mix
    .setPublicPath('dist')
    .ts('src/js/app.ts', 'dist/assets')
    .less('src/scss/app.less', 'dist/assets')
    .copy('src/html', 'dist');
