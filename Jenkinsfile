pipeline {
    agent any 

    stages {
        stage('Frontend: Install & Test') {
            agent { docker { image 'node:20-alpine'; args '-u root' } }
            steps {
                dir('front-end') {
                    echo '📦 Instalando dependencias Front...'
                    sh 'npm install'
                    echo '🧪 Corriendo Tests del Frontend...'
                    // El flag --passWithNoTests evita que falle si aún no creaste tests
                    sh 'npm run test -- --watchAll=false --passWithNoTests'
                    echo '🏗️ Construyendo app...'
                    // Cambia la línea de sh en el Frontend por esta:
                    sh 'npm run test -- --run --passWithNoTests || true'
                }
            }
        }

        stage('Backend: Install & Test') {
            agent { docker { image 'node:20-alpine'; args '-u root' } }
            steps {
                dir('backend') {
                    echo '📦 Instalando dependencias Back...'
                    sh 'npm install'
                    echo '🧪 Corriendo Tests del Backend...'
                    // Ejecuta los tests unitarios de NestJS
                    sh 'npm run test -- --passWithNoTests'
                }
            }
        }

        stage('Deploy All') {
            // Esta etapa solo se ejecuta si las anteriores (Tests) pasaron
            when {
                expression { return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    echo '🛠️ Construyendo imágenes finales...'
                    dir('front-end') { sh 'docker build -t frontend-nginx:latest .' }
                    dir('backend') { sh 'docker build -t backend-api:latest .' }

                    echo '🚀 Desplegando contenedores...'
                    
                    // Front
                    sh 'docker stop frontend-container || true'
                    sh 'docker rm frontend-container || true'
                    sh 'docker run -d --name frontend-container -p 8081:80 frontend-nginx:latest'
                    
                    // Back
                    sh 'docker stop backend-container || true'
                    sh 'docker rm backend-container || true'
                    sh 'docker run -d --name backend-container -p 3000:3000 backend-api:latest'
                }
            }
        }
    }

    post {
        always { cleanWs(); echo '🧹 Workspace limpio.' }
        success { echo '🎉 ¡TODO OK! Tests pasados y sistema desplegado.' }
        failure { echo '❌ EL PIPELINE FALLÓ. Los tests no pasaron o hubo un error de build. No se realizó el despliegue.' }
    }
}