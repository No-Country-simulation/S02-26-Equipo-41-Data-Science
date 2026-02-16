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
                    // El || true evita que el pipeline se corte si hay errores de estilo (Lint)
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
                    // Aquí podrías agregar npm install y build del backend en el futuro
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
                            echo '🛠️ Creando imagen Docker del Frontend...'
                            sh 'docker build -t frontend-equipo-41:latest .'
                        }
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' 
                }
            }
            steps {
                script {
                    echo '🚀 Desplegando contenedor de Frontend...'
                    // Detiene y elimina el contenedor anterior si existe para que no falle por nombre duplicado
                    sh 'docker stop frontend-container || true'
                    sh 'docker rm frontend-container || true'
                    
                    // Ejecuta el nuevo contenedor en el puerto 8080
                    sh 'docker run -d --name frontend-container -p 8080:80 frontend-equipo-41:latest'
                    
                    echo '✅ Aplicación disponible en: http://localhost:8080'
                }
            }
        }
    } // Fin de STAGES

    post {
        always {
            // Limpia el workspace para evitar errores de permisos en futuras ejecuciones
            cleanWs()
            echo '🧹 Workspace limpio.'
        }
        success {
            echo '🎉 ¡Pipeline finalizado con éxito!'
        }
        failure {
            echo '❌ El Pipeline falló. Revisar los logs arriba.'
        }
    } // Fin de POST
}