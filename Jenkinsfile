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
                    echo '📦 Instalando dependencias...'
                    sh 'npm install'
                    echo '🏗️ Construyendo app (Vite)...'
                    sh 'npm run build --if-present'
                }
            }
        }

        stage('Build & Deploy (Manual Mode)') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' 
                }
            }
            steps {
                script {
                    echo '🛠️ Construyendo imagen con Nginx...'
                    dir('front-end') {
                        // Construimos la imagen usando el Dockerfile de Nginx que ya creaste
                        sh 'docker build -t frontend-nginx:latest .'
                    }

                    echo '🚀 Desplegando contenedor...'
                    // Limpiamos contenedores viejos
                    sh 'docker stop frontend-container || true'
                    sh 'docker rm frontend-container || true'
                    
                    // IMPORTANTE: Mapeamos el puerto 8081 al 80 (donde escucha Nginx)
                    sh 'docker run -d --name frontend-container -p 8081:80 frontend-nginx:latest'
                    
                    echo '✅ ¡Web lista en http://localhost:8081!'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            echo '🧹 Workspace limpio.'
        }
        success {
            echo '🎉 ¡SUCCESS! Revisa el puerto 8081.'
        }
        failure {
            echo '❌ Falló. Revisa que el Dockerfile esté en la carpeta front-end.'
        }
    }
}