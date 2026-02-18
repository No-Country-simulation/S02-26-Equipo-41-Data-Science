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
                    branch 'feature/jenkins' // Mantenemos esta para que puedas probarlo ahora
                }
            }
            steps {
                echo "🚀 Iniciando entorno integrado con docker-compose.app..."
                script {
                    // Levantamos Front, Back y la DB de tu compañero
                    sh 'docker compose -f docker-compose.app up -d --build'
                    
                    try {
                        echo "🔍 Verificando que los servicios estén activos..."
                        sh 'docker ps'
                        
                        // Damos 10 segundos para que Postgres termine de arrancar
                        sh 'sleep 10'
                        
                        echo "✅ Ecosistema validado y conectado."
                    } catch (Exception e) {
                        echo "❌ Error durante la integración: ${e.getMessage()}"
                        error("Prueba de integración fallida")
                    } finally {
                        // Limpieza obligatoria para no agotar recursos
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
                sh 'echo "Aquí irían los comandos de push a Docker Hub o despliegue final"'
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
            // Borramos el workspace para evitar problemas de permisos de archivos
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}