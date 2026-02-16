pipeline {
    agent any 

    stages {
        stage('Frontend: Setup & Build') {
            agent { docker { image 'node:20-alpine'; args '-u root' } }
            steps {
                dir('front-end') {
                    echo '📦 Instalando dependencias Front...'
                    sh 'npm install'
                    sh 'npm run build --if-present'
                }
            }
        }

        stage('Backend: Setup & Build') {
            agent { docker { image 'node:20-alpine'; args '-u root' } }
            steps {
                dir('backend') {
                    echo '📦 Instalando dependencias Back...'
                    sh 'npm install'
                    // Si tienes tests, podrías agregarlos aquí: sh 'npm test'
                }
            }
        }

        stage('Deploy All') {
            when {
                expression { return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    echo '🛠️ Construyendo imágenes...'
                    // Build Front
                    dir('front-end') { sh 'docker build -t frontend-nginx:latest .' }
                    // Build Back
                    dir('backend') { sh 'docker build -t backend-api:latest .' }

                    echo '🚀 Desplegando contenedores...'
                    
                    // Reiniciar Front
                    sh 'docker stop frontend-container || true'
                    sh 'docker rm frontend-container || true'
                    sh 'docker run -d --name frontend-container -p 8081:80 frontend-nginx:latest'
                    
                    // Reiniciar Back
                    sh 'docker stop backend-container || true'
                    sh 'docker rm backend-container || true'
                    sh 'docker run -d --name backend-container -p 3000:3000 backend-api:latest'
                    
                    echo '✅ ¡Sistema completo en línea!'
                }
            }
        }
    }

    post {
        always { cleanWs(); echo '🧹 Workspace limpio.' }
        success { echo '🎉 ¡TODO OK! Front: :8081 | Back: :3000' }
    }
}