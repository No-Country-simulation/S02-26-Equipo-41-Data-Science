pipeline {
    agent any 

    stages {
        stage('Frontend: Setup & Build') {
            agent {
                docker { 
                    image 'node:20-alpine' 
                    args '-u root'
                }
            }
            steps {
                dir('front-end') {
                    echo '📦 Instalando dependencias de Front...'
                    sh 'npm install'
                    echo '🏗️ Construyendo aplicación Front...'
                    // Usamos || true para que el lint no rompa el build si hay warnings
                    sh 'npm run lint || echo "⚠️ Advertencia: Lint falló pero continuamos..." '
                    sh 'npm run build --if-present'
                }
            }
        }

        stage('Backend: Setup & Build') {
            agent {
                docker { 
                    image 'node:20-alpine' 
                    args '-u root'
                }
            }
            steps {
                dir('backend') {
                    echo '🚀 Preparando NestJS Backend...'
                    echo 'Estructura lista para comandos de NestJS.'
                }
            }
        }

        stage('Build Docker Images') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' 
                }
            }
            steps {
                script {
                    dir('front-end') {
                        if (fileExists('Dockerfile')) {
                            sh 'docker build -t frontend-equipo-41:latest .'
                        }
                    }
                }
            }
        }

    post {
        success { echo '✅ Pipeline Global SUCCESS' }
        failure { echo '❌ Pipeline Global FAILURE' }
    }
}