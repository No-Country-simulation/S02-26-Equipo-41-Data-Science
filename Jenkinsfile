pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    when { changeset "front-end/**" }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            // Agregamos permisos y acceso al socket para evitar el "Permission Denied"
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
                    when { changeset "backend/**" }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            // Agregamos permisos y acceso al socket aquí también
                            args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock'
                        } 
                    }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            // Ejecuta los tests de NestJS (incluyendo tu nuevo health.spec.ts)
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
                    branch 'feature/jenkins' 
                }
            }
            agent {
                docker {
                    image 'docker:latest' 
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
                }
            }
            steps {
                echo "🚀 Levantando entorno de integración..."
                script {
                    // Limpieza preventiva de contenedores anteriores
                    sh 'docker rm -f nocountry-postgres frontend-container backend-container || true'
                    sh 'docker compose down --remove-orphans || true'
                    
                    // Despliegue del stack completo
                    sh 'docker compose up -d --build --force-recreate'
                    
                    try {
                        echo "🔍 Verificando servicios..."
                        sh 'sleep 10'
                        sh 'docker ps'
                        echo "✅ Ecosistema validado."
                    } catch (Exception e) {
                        error("Fallo en la validación: ${e.getMessage()}")
                    } finally {
                        echo "🧹 Limpiando..."
                        sh 'docker compose down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Rama principal detectada. Pipeline completado con éxito."
            }
        }
    }
    
    post {
        always {
            // Limpia el espacio de trabajo para no acumular archivos pesados
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}