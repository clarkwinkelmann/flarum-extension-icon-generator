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
    .setPublicPath('docs')
    .ts('src/js/app.ts', 'docs/assets')
    .less('src/scss/app.less', 'docs/assets')
    .copy('src/html', 'docs');
