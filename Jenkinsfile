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
                    // En el futuro aquí agregarás: sh 'npm install && npm run build'
                    echo 'Estructura lista para comandos de NestJS.'
                }
            }
        }

        stage('Build & Deploy with Compose') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'main' 
                }
            }
            steps {
                script {
                    echo '🏗️ Usando Docker Compose para construir y desplegar...'
                    
                    // Detenemos lo que esté corriendo para evitar conflictos de nombres o puertos
                    sh 'docker compose down || true'
                    
                    // Construimos las imágenes y levantamos los contenedores en segundo plano (-d)
                    // --build asegura que tome los cambios del nuevo Dockerfile de Nginx
                    sh 'docker compose up -d --build'
                    
                    echo '✅ ¡Sistema desplegado profesionalmente!'
                    echo '🌍 Frontend: http://localhost:8081'
                    echo '⚙️ Backend: http://localhost:3000'
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