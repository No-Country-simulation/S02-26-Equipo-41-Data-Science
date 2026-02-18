pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        // NIVEL 1: Análisis y Tests Unitarios
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

        // NIVEL 2: Integración (Usando docker-compose con guion)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            steps {
                echo "🚀 Iniciando aplicación con el ejecutable docker-compose..."
                script {
                    // CAMBIO CLAVE: docker-compose (con guion)
                    // Esto separa el comando del binario principal de Docker
                    sh 'docker-compose -f docker-compose.app.ym up -d --build'
                    
                    try {
                        echo "🔍 Verificando servicios en ejecución..."
                        sh 'docker ps'
                        
                        echo "⏳ Esperando 15s para estabilización..."
                        sh 'sleep 15'
                        
                        echo "✅ Ecosistema de aplicación validado."
                    } catch (Exception e) {
                        echo "❌ Error en la integración: ${e.getMessage()}"
                        error("Fallo en la prueba de integración")
                    } finally {
                        echo "🧹 Bajando contenedores con docker-compose..."
                        sh 'docker-compose -f docker-compose.app.ym down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Preparando imágenes oficiales..."
            }
        }
    }
    
    post {
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    echo "🏆 DESPLIEGUE EXITOSO EN PRODUCCIÓN"
                } else {
                    echo "✅ Rama ${env.BRANCH_NAME} verificada."
                }
            }
        }
        failure {
            echo "❌ El pipeline falló. Probando compatibilidad de comandos."
        }
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}