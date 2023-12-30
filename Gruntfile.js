module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: { // O LESS divide a compilação em desenvolvimento e produção
            development: { // Será executado no ambiente de desenvolvimento ou "ambiente local" (Máquina) 
                files: {
                    'dev/styles/main.css': 'src/styles/main.less' // destino: pasta dev/styles | origem: pasta src/styles  
                }
            },
            production: { // Será executado no ambiente de produção (Vercel ou servidor)
                options: {
                    compress: true, 
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'  // destino: pasta dist/styles | origem: pasta src/styles
                }
            }
        },
        watch: {
            less: {
                files: ['src/styles/**/*.less'], // src/styles/** = qualquer pasta dentro de src/styles e /*.less = qualquer arquivo .less
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'], // monitorando index.html para que em qualquer mudança execute a tarefa abaixo
                tasks: ['replace:dev'] // atualiza index.html alocado na pasta ./dev
            }
        },
        replace: { // substituir textos em arquivos por meio de padrões de busca e substituição.
            dev: {
                options: {
                    patterns: [ // matriz de objetos de padrões de substituição.
                        {
                            match: 'ENDERECO_DO_CSS', // O padrão para se substituir
                            replacement: './styles/main.css' //O texto que substituirá o padrão correspondente
                        },
                        {
                            match: 'ENDERECO_DO_JS', // O padrão para se substituir
                            replacement: '../src/scripts/main.js' //O texto que substituirá o padrão correspondente
                        }
                    ]
                },
                files: [ // matriz de objetos que especifica quais arquivos devem ser processados e onde os resultados devem ser salvos.
                    {
                        expand: true, // permite o processamento de padrões em caminhos de arquivos.
                        flatten: true, // garante que todos os arquivos finais sejam copiados para a mesma pasta de destino, removendo os caminhos relativos.
                        src: ['src/index.html'], // especifica o(s) arquivo(s) de origem que serão processados
                        dest:'dev/' // indica o diretório de destino para os arquivos processados
                        
                        /* Resumindo, essa tarefa do Grunt substitui o padrão 'ENDERECO_DO_CSS' 
                        pelo caminho ./styles/main.css no arquivo src/index.html 
                        e coloca o resultado no diretório dev/. */
                    }
                ]
            },
            dist: { // mesma substituição feita em dev: desta vez em dist
                options: {
                    patterns: [ 
                        {
                            match: 'ENDERECO_DO_CSS', 
                            replacement: './styles/main.min.css' // substituição da string pelo caminho do .css minificado 
                        },
                        {
                            match: 'ENDERECO_DO_JS', 
                            replacement: './scripts/main.min.js' // substituição da string pelo caminho do .js minificado
                        }
                    ]
                },
                files: [ 
                    {
                        expand: true, 
                        flatten: true, 
                        src: ['prebuild/index.html'], // desta vez o index.html é buscado na pasta temporária "prebuild"
                        dest:'dist/' // diretório de destino desta vez é o dist (build)
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true, // remove comentários
                    collapseWhitespace: true // transforma todo o index.html numa linha só
                },
                files: {
                    'prebuild/index.html': 'src/index.html' // arquivo de destino: arquivo de origem
                    //1º minificação
                    //2º substituição através de uma pasta temporária nomeada "prebuild"
                    // testar rodando o comando npm run grunt htmlmin:dist 
                }
            }
        },
        clean: ['prebuild'],
        uglify: {
            target: {
                files: {
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })
    

    //carregando o plugin grunt-contrib-less
    grunt.loadNpmTasks('grunt-contrib-less');
    
    //carregando o plugin grunt-contrib-watch
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    //carregando o plugin grunt-replace
    grunt.loadNpmTasks('grunt-replace');
    
    //carregando o plugin grunt-contrib-htmlmin
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    
    //carregando o plugin grunt-contrib-clean
    grunt.loadNpmTasks('grunt-contrib-clean');

    //carregando o plugin grunt-contrib-uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']); 
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); 
    
    // ['watch'] - está monitorando a compilação de less:development para qualquer modificação nos arquivos .less
    // 'less:production' - tarefa acessando o ambiente de produção na compilação 
    // 'htmlmin:dist' - tarefa minificando o index.html
    // 'replace:dist' - tarefa substituindo o href do index.html das pastas "dev" e "dist"
    // 'clean' - tarefa para "limpar" excluindo a pasta temporária "prebuild" 
    // 'uglify' - tarefa minificando o main.js
    
    
    // build é o termo que se usa para publicar a aplicação no ambiente produtivo. "buildar"
    // ['less:development'] argumento acessando o ambiente de desenvolvimento na compilação
    /*
       devido a configuração feita no arquivo package.json
       "scripts": {
         "grunt": "grunt",
         "build": "grunt build",
         ...
       }
       >npm run grunt executa somente a task 'default',['less:development'] criando o arquivo em (dev/styles/main.css)
       >npm run build executa somente a task 'build',['less:production'] criando o arquivo minificado (dist/styles/main.min.css)
    */
}