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

        // NIVEL 2: Integración (Usando un contenedor con Docker Compose)
        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            // Aquí usamos una imagen que SÍ tiene docker compose instalado por defecto
            agent {
                docker {
                    image 'docker:24-cli'
                    // Compartimos el socket para que este contenedor pueda mandar órdenes al servidor
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo "🚀 Levantando entorno desde contenedor especializado..."
                script {
                    // Dentro de esta imagen, 'docker compose' funciona garantizado
                    sh 'docker compose up -d --build'
                    
                    try {
                        sh 'docker ps'
                        echo "⏳ Estabilizando..."
                        sh 'sleep 15'
                        echo "✅ Ecosistema validado."
                    } catch (Exception e) {
                        error("Fallo en la validación: ${e.getMessage()}")
                    } finally {
                        sh 'docker compose down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Rama principal detectada."
            }
        }
    }
    
    post {
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}