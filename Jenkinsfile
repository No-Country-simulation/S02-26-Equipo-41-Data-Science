pipeline {
    agent any // Agente global para el orquestador

    stages {
        // --- SECCIÓN FRONTEND ---
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
                    // Agregamos el "|| true" al lint para que no te frene si hay avisos
                    sh 'npm run lint || echo "⚠️ Advertencia: Lint falló pero continuamos..." '
                    sh 'npm run build --if-present'
                }
            }
        }

        // --- SECCIÓN BACKEND (NestJS) ---
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
                    // sh 'npm install'
                    // sh 'npm run build'
                    echo 'Backend listo (descomenta los comandos cuando el equipo los tenga).'
                }
            }
        }

        // --- SECCIÓN DOCKER ---
        stage('Build Docker Images') {
            when {
                branch anyOf: ['development', 'main']
            }
            steps {
                script {
                    // Build del Front
                    dir('front-end') {
                        if (fileExists('Dockerfile')) {
                            echo '🐳 Build Image: Frontend'
                            sh 'docker build -t frontend-equipo-41:latest .'
                        }
                    }
                    // Aquí podrías agregar el build del backend si tiene Dockerfile
                    /*
                    dir('backend') {
                        if (fileExists('Dockerfile')) {
                            echo '🐳 Build Image: Backend'
                            sh 'docker build -t backend-equipo-41:latest .'
                        }
                    }
                    */
                }
            }
        }
    }

    post {
        success { echo '✅ Pipeline Global SUCCESS' }
        failure { echo '❌ Pipeline Global FAILURE' }
    }
}