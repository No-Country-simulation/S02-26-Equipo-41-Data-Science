pipeline {
    agent none 
    triggers { githubPush() }
    
    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0' 
                        } 
                    }
                    steps { 
                        dir('front-end') { 
                            sh 'npm install && npx vitest run --passWithNoTests' 
                        } 
                    }
                }
                stage('Backend Check') {
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0' 
                        } 
                    }
                    steps { 
                        dir('backend') { 
                            sh 'npm install && npm run test -- --passWithNoTests' 
                        } 
                    }
                }
            }
        }

        stage('CD: Integration Test & Health Check') {
            agent {
                docker {
                    image 'docker:latest'
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                script {
                    echo "🧹 Limpiando y reconstruyendo entorno..."
                    sh 'docker compose down --remove-orphans || true'
                    sh 'docker compose build --no-cache backend'
                    sh 'docker compose up -d --force-recreate'
                    
                    echo "🔍 Iniciando validación de salud (Health Check)..."
                    
                    // Aquí insertamos el script que faltaba en tu log
                    def healthCheck = sh(script: '''
                        count=0
                        while [ $count -lt 12 ]; do
                            echo "Probando conexión... Intento $((count+1))/12"
                            # Intentamos conectar al contenedor del backend
                            if docker exec backend-container wget -qO- http://localhost:3000/health > /dev/null; then
                                echo "✅ EL BACKEND RESPONDE CORRECTAMENTE"
                                exit 0
                            fi
                            sleep 5
                            count=$((count+1))
                        done
                        echo "❌ EL BACKEND NO RESPONDIÓ A TIEMPO"
                        exit 1
                    ''', returnStatus: true)

                    if (healthCheck != 0) {
                        sh 'docker logs backend-container'
                        error("Falló el Health Check: El backend no está saludable.")
                    }
                }
            }
            post {
                always {
                    echo "🧹 Limpiando contenedores..."
                    sh 'docker compose down'
                }
            }
        }
    }
}