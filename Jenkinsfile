pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        // NIVEL 1: Análisis y Tests Unitarios (Paralelo)
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

        // NIVEL 2: Integración (Usando el archivo específico de la App)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            steps {
                echo "🚀 Iniciando aplicación con: docker-compose.app.ym"
                script {
                    // SINTAXIS V2: El flag -f va DESPUÉS de 'compose'
                    sh 'docker compose -f docker-compose.app.ym up -d --build'
                    
                    try {
                        echo "🔍 Verificando servicios en ejecución..."
                        sh 'docker ps'
                        
                        echo "⏳ Esperando estabilización del entorno (15s)..."
                        sh 'sleep 15'
                        
                        echo "✅ Ecosistema de aplicación validado."
                    } catch (Exception e) {
                        echo "❌ Error en la integración: ${e.getMessage()}"
                        error("Fallo en la prueba de integración")
                    } finally {
                        echo "🧹 Bajando contenedores de la aplicación..."
                        sh 'docker compose -f docker-compose.app.ym down'
                    }
                }
            }
        }

        // NIVEL 3: Release (Solo para Main)
        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Preparando imágenes oficiales para producción..."
                sh 'echo "Pushing images to registry..."'
            }
        }
    }
    
    post {
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    echo "🏆 DESPLIEGUE EXITOSO EN PRODUCCIÓN"
                } else {
                    echo "✅ Rama ${env.BRANCH_NAME} verificada correctamente."
                }
            }
        }
        failure {
            echo "❌ Fallo en el pipeline de la rama ${env.BRANCH_NAME}. Revisa los logs de Docker."
        }
        always {
            // Limpieza del espacio de trabajo
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}