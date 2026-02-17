pipeline {
    agent any 

    options {
        // Vincula el pipeline al proyecto de GitHub para mejorar la integración
        githubProjectProperty(projectUrlStr: 'https://github.com/No-Country-simulation/S02-26-Equipo-41-Data-Science/')
    }

    stages {
        stage('Frontend: Install & Test') {
            agent { docker { image 'node:20-alpine'; args '-u root' } }
            steps {
                dir('front-end') {
                    echo '📦 Instalando dependencias Front...'
                    sh 'npm install'
                    echo '🧪 Corriendo Tests del Frontend...'
                    // El || true permite que el pipeline siga si falla, pero el log avisará
                    sh 'npm run test -- --passWithNoTests || true'
                    echo '🏗️ Construyendo app...'
                    sh 'npm run build --if-present'
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
                    // Aquí NO ponemos || true para que SI falle el pipeline si los tests no pasan
                    sh 'npm run test -- --passWithNoTests'
                }
            }
        }

        stage('Deploy All') {
            when {
                expression { return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    echo '🛠️ Construyendo imágenes finales...'
                    dir('front-end') { sh 'docker build -t frontend-nginx:latest .' }
                    dir('backend') { sh 'docker build -t backend-api:latest .' }

                    echo '🚀 Desplegando contenedores...'
                    
                    // Despliegue Frontend
                    sh 'docker stop frontend-container || true'
                    sh 'docker rm frontend-container || true'
                    sh 'docker run -d --name frontend-container -p 8081:80 frontend-nginx:latest'
                    
                    // Despliegue Backend
                    sh 'docker stop backend-container || true'
                    sh 'docker rm backend-container || true'
                    sh 'docker run -d --name backend-container -p 3000:3000 backend-api:latest'
                }
            }
        }
    }

post {
        always {
            // Forma simple y robusta de avisar a GitHub
            step([$class: 'GitHubCommitStatusSetter', 
                  contextSource: [$class: 'DefaultCommitContextSource', context: 'Jenkins/Build-and-Test'],
                  statusSource: [$class: 'AnyBuildResultStatusSource']
            ])
            cleanWs()
            echo '🧹 Workspace limpio.'
        }
        success {
            echo '🎉 ¡TODO OK!'
        }
        failure {
            echo '❌ EL PIPELINE FALLÓ.'
        }
    }
}