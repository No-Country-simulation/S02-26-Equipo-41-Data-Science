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
                            // MODIFICACIÓN: Agregamos una DATABASE_URL ficticia para que Prisma genere el cliente sin protestar
                            sh '''
                                npm install
                                export DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"
                                npx prisma generate
                                npm run test -- --passWithNoTests
                            '''
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
                    echo "🧹 Limpiando colisiones de nombres y contenedores previos..."
                    sh 'docker rm -f frontend-container backend-container nocountry-postgres || true'
                    sh 'docker compose down --remove-orphans || true'
                    
                    echo "🛠️ Construyendo imagen de Backend..."
                    sh 'docker compose build --no-cache backend'
                    
                    echo "🚀 Levantando servicios..."
                    sh 'docker compose up -d --force-recreate'
                    
                    echo "🔍 Iniciando validación de salud (Health Check)..."
                    def healthCheck = sh(script: '''
                        count=0
                        while [ $count -lt 12 ]; do
                            echo "Probando conexión a http://localhost:3000/health... Intento $((count+1))/12"
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
                        echo "⚠️ Extrayendo logs del backend para depuración:"
                        sh 'docker logs backend-container'
                        error("Falló el Health Check: El backend no está saludable.")
                    }
                }
            }
            post {
                always {
                    echo "🧹 Limpiando entorno de integración..."
                    sh 'docker compose down'
                }
            }
        }
    }
}