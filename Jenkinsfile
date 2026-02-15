pipeline {
    agent none 

    stages {
        // --- ESTE STAGE ELIMINA LOS ARCHIVOS BLOQUEADOS ---
        stage('Fix Permissions & Cleanup') {
            agent {
                docker { 
                    image 'alpine'
                    args '-u root' 
                }
            }
            steps {
                echo '🧹 Limpiando archivos protegidos de ejecuciones anteriores...'
                // Borramos node_modules y cualquier rastro de root
                sh 'rm -rf ./*/node_modules || true'
                sh 'rm -rf ./*/.npm || true'
            }
        }

        stage('Install & Build Frontend') {
            agent {
                docker { 
                    image 'node:20-alpine' 
                    args '-u root'
                }
            }
            steps {
                dir('front-end') {
                    echo '📦 Instalando dependencias...'
                    sh 'npm install'
                    echo '🏗️ Generando build...'
                    sh 'npm run build --if-present'
                }
            }
        }

        stage('Build Docker Image') {
            agent any 
            steps {
                script {
                    if (fileExists('Dockerfile')) {
                        echo '🐳 Construyendo imagen desde el host...'
                        sh 'docker build -t frontend-equipo-41:latest .'
                    } else {
                        echo '❌ No se encontró Dockerfile en la raíz'
                    }
                }
            }
        }
    }

    post {
        success { echo '✅ ¡Pipeline exitoso!' }
        failure { echo '❌ Falló el pipeline.' }
    }
}