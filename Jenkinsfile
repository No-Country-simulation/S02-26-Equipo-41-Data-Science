pipeline {
    agent none 

    triggers {
        githubPush()
    }

    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    when { 
                        anyOf {
                            branch 'feature/jenkins'
                            branch 'development'
                            changeset "front-end/**"
                        }
                    }
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
                    when { 
                        anyOf {
                            branch 'feature/jenkins'
                            branch 'development'
                            changeset "backend/**"
                        }
                    }
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

        stage('CD: Integration Test & Health Check') {
            when { 
                anyOf {
                    branch 'feature/jenkins'
                    branch 'development'
                    branch 'main'
                }
            }
            agent {
                docker {
                    image 'docker:latest' 
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
                }
            }
            steps {
                script {
                    echo "🚀 Levantando entorno de integración..."
                    sh 'docker compose down --remove-orphans || true'
                    sh 'docker compose up -d --build --force-recreate'
                    
                    echo "🔍 Iniciando validación técnica (Health Check)..."
                    
                    // Script de validación: reintenta cada 5 segundos hasta 10 veces
                    def healthCheck = sh(script: '''
                        count=0
                        while [ $count -lt 10 ]; do
                            echo "Probing http://localhost:3000/health... (Attempt: $((count+1)))"
                            if docker exec backend-container wget -qO- http://localhost:3000/health > /dev/null; then
                                echo "✅ VALIDACIÓN EXITOSA: El backend está online."
                                exit 0
                            fi
                            sleep 5
                            count=$((count+1))
                        done
                        echo "❌ ERROR: El Health Check falló tras 50 segundos."
                        exit 1
                    ''', returnStatus: true)

                    if (healthCheck != 0) {
                        echo "📄 LOGS DE EMERGENCIA (Backend):"
                        sh 'docker logs backend-container'
                        error("El test de integración falló: el servicio no está saludable.")
                    }
                }
            }
            post {
                always {
                    echo "🧹 Limpiando contenedores de prueba..."
                    sh 'docker compose down'
                }
            }
        }
    }
}