pipeline {
    agent none // Evita el bloqueo de ejecutores en el parallel

    triggers {
        githubPush()
    }

    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    // Se ejecuta si hay cambios en la carpeta o si es un merge a development
                    when { 
                        anyOf {
                            changeset "front-end/**"
                            branch 'development'
                        }
                    }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock' 
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
                    when { 
                        anyOf {
                            changeset "backend/**"
                            branch 'development'
                        }
                    }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
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

        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                }
            }
            agent {
                docker {
                    image 'docker:latest' 
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
                }
            }
            steps {
                script {
                    echo "🚀 Levantando entorno de integración..."
                    // Limpieza total antes de empezar
                    sh 'docker compose down --remove-orphans || true'
                    
                    // Construcción y arranque
                    sh 'docker compose up -d --build --force-recreate'
                    
                    try {
                        echo "🔍 Esperando 20 segundos para estabilizar servicios..."
                        sh 'sleep 20'
                        
                        sh 'docker ps'
                        
                        // --- ESTO TE DIRÁ POR QUÉ EL BACKEND REINICIA ---
                        echo "📄 LOGS DEL BACKEND:"
                        sh 'docker logs backend-container'
                        
                        echo "📄 LOGS DE LA BASE DE DATOS:"
                        sh 'docker logs nocountry-postgres'
                        
                    } catch (Exception e) {
                        echo "❌ Error en el proceso: ${e.getMessage()}"
                        error("Fallo técnico en la integración")
                    } finally {
                        echo "🧹 Limpiando contenedores..."
                        sh 'docker compose down'
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}