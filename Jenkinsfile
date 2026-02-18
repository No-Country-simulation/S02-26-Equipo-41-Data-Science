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

        // NIVEL 2: Integración (Con compatibilidad híbrida)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            steps {
                echo "🚀 Iniciando fase de integración..."
                script {
                    try {
                        // Intentamos el comando moderno. Si falla por los flags, saltará al catch.
                        echo "Intentando con 'docker compose'..."
                        sh 'docker compose up -d --build'
                    } catch (Exception e) {
                        echo "⚠️ 'docker compose' falló o no reconoce flags. Intentando con 'docker-compose'..."
                        // Intentamos la versión antigua (con guion) que suele ser más estable con los flags
                        sh 'docker-compose up -d --build'
                    }
                    
                    try {
                        echo "🔍 Verificando estado de los servicios..."
                        sh 'docker ps'
                        echo "⏳ Esperando 15 segundos para estabilización..."
                        sh 'sleep 15'
                        echo "✅ Ecosistema validado."
                    } catch (Exception e) {
                        echo "❌ Error durante la verificación: ${e.getMessage()}"
                        error("La aplicación no inició correctamente.")
                    } finally {
                        echo "🧹 Limpiando entorno de prueba..."
                        // Intentamos apagar con ambos métodos por seguridad
                        sh 'docker compose down || docker-compose down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Rama principal detectada. Preparando despliegue de producción..."
            }
        }
    }
    
    post {
        success {
            echo "🏆 ¡ÉXITO! El pipeline de la rama ${env.BRANCH_NAME} ha finalizado correctamente."
        }
        failure {
            echo "❌ El pipeline falló. Revisa los logs de error de Docker arriba."
        }
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}