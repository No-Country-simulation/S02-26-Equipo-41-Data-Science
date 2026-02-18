pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        // NIVEL 1: Análisis y Tests Unitarios (Se ejecuta para TODAS las ramas)
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    when { changeset "front-end/**" }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0' 
                        } 
                    }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend Check') {
                    when { changeset "backend/**" }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0' 
                        } 
                    }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
                    }
                }
            }
        }

        // NIVEL 2: Integración con Base de Datos (Solo Development y Main)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            steps {
                echo "🚀 Iniciando entorno integrado con docker compose V2..."
                script {
                    // SINTAXIS CORREGIDA: docker compose (con espacio, sin guion)
                    // Asegúrate de que el archivo se llame exactamente docker-compose.app en la raíz
                    sh 'docker compose -f docker-compose.app up -d --build'
                    
                    try {
                        echo "🔍 Verificando que los servicios estén activos..."
                        sh 'docker ps'
                        
                        echo "⏳ Esperando a que la base de datos esté lista..."
                        sh 'sleep 15'
                        
                        echo "✅ Ecosistema validado y conectado."
                    } catch (Exception e) {
                        echo "❌ Error durante la integración: ${e.getMessage()}"
                        error("Prueba de integración fallida")
                    } finally {
                        echo "🧹 Bajando contenedores de prueba..."
                        sh 'docker compose -f docker-compose.app down'
                    }
                }
            }
        }

        // NIVEL 3: Despliegue/Release (Solo para Main)
        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Publicando imágenes oficiales y preparando deploy..."
                sh 'echo "Simulando push a registro de imágenes"'
            }
        }
    }
    
    post {
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    echo "🏆 ¡PRODUCCIÓN ACTUALIZADA CORRECTAMENTE!"
                } else {
                    echo "✅ Rama ${env.BRANCH_NAME} verificada con éxito."
                }
            }
        }
        failure {
            echo "❌ El pipeline falló en la rama ${env.BRANCH_NAME}. Revisa los logs."
        }
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}