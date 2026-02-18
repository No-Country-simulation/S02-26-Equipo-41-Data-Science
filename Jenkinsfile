pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        // NIVEL 1: Siempre se ejecuta (para cualquier rama)
        // Queremos asegurar que NADA rompa el código base.
        stage('CI: Tests Rápidos') {
            parallel {
                stage('Frontend Check') {
                    when { changeset "front-end/**" }
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend Check') {
                    when { changeset "backend/**" }
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
                    }
                }
            }
        }

        // NIVEL 2: Solo para Development o ramas de integración
        // Aquí el proceso es más pesado (Build de Docker).
        stage('CD: Build & Registry') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                }
            }
            steps {
                echo "🚀 Rama importante detectada: Generando imágenes de Docker..."
                script {
                    dir('backend') { sh 'docker build -t s02-backend:latest .' }
                    dir('front-end') { sh 'docker build -t s02-frontend:latest .' }
                }
            }
        }

        // NIVEL 3: Solo para Main
        // Este stage simula el paso final a producción.
        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Publicando versión oficial en Main..."
                // Aquí podrías taggear la imagen como :v1.0, :stable, etc.
                sh 'echo "Simulando push a DockerHub o despliegue a AWS"'
            }
        }
    }
    
    post {
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    echo "🏆 ¡PRODUCCIÓN ACTUALIZADA!"
                } else {
                    echo "✅ Rama ${env.BRANCH_NAME} verificada."
                }
            }
        }
        failure { echo "❌ Error en el Pipeline de ${env.BRANCH_NAME}." }
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}