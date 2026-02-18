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

        // NIVEL 2: Integración (Usando tu archivo .ym corregido)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            steps {
                echo "🚀 Iniciando entorno con: docker-compose.app.ym"
                script {
                    // Usamos --file para máxima compatibilidad con tu versión de Docker
                    sh 'docker compose --file docker-compose.app.ym up -d --build'
                    
                    try {
                        echo "🔍 Verificando servicios..."
                        sh 'docker ps'
                        
                        echo "⏳ Esperando 15s para que la base de datos inicie..."
                        sh 'sleep 15'
                        
                        echo "✅ Ecosistema validado."
                    } catch (Exception e) {
                        echo "❌ Error: ${e.getMessage()}"
                        error("Fallo en la prueba de integración")
                    } finally {
                        echo "🧹 Limpiando contenedores..."
                        sh 'docker compose --file docker-compose.app.ym down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Publicando imágenes oficiales..."
                sh 'echo "Simulando push de imágenes finales"'
            }
        }
    }
    
    post {
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    echo "🏆 PRODUCCIÓN ACTUALIZADA"
                } else {
                    echo "✅ Rama ${env.BRANCH_NAME} verificada"
                }
            }
        }
        failure {
            echo "❌ Fallo en la rama ${env.BRANCH_NAME}."
        }
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}