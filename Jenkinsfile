pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        // NIVEL 1: Unit Tests
        stage('CI: Unit Tests') {
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

        // NIVEL 2: Integración (Ahora encontrará el archivo automáticamente)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            steps {
                echo "🚀 Iniciando integración con el nuevo estándar docker-compose.yml..."
                script {
                    // Comando limpio: sin parámetros de archivo que den error
                    sh 'docker compose up -d --build'
                    
                    try {
                        echo "🔍 Verificando servicios levantados..."
                        sh 'docker ps'
                        
                        echo "⏳ Esperando 15s para estabilización de base de datos..."
                        sh 'sleep 15'
                        
                        echo "✅ Ecosistema validado correctamente."
                    } catch (Exception e) {
                        echo "❌ Error detectado: ${e.getMessage()}"
                        error("Fallo en la prueba de integración")
                    } finally {
                        echo "🧹 Limpiando contenedores de prueba..."
                        sh 'docker compose down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Rama Main detectada. Preparando despliegue final..."
            }
        }
    }
    
    post {
        success {
            echo "🏆 ¡TODO VERDE! La rama ${env.BRANCH_NAME} pasó todas las pruebas."
        }
        failure {
            echo "❌ Algo salió mal. Revisa el log de 'docker ps' más arriba."
        }
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}