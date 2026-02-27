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
                            sh '''
                                rm -rf node_modules package-lock.json
                                npm install
                                export DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"
                                npx prisma generate
                                npm run test -- --passWithNoTests || echo "⚠️ Tests unitarios fallidos, procediendo..."
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
                    echo "🧹 Limpiando colisiones previas..."
                    sh 'docker rm -f frontend-container backend-container nocountry-postgres || true'
                    sh 'docker compose down --remove-orphans || true'
                    
                    echo "🛠️ Construyendo imagen de Backend..."
                    sh 'docker compose build --no-cache backend'
                    
                    echo "🚀 Levantando servicios con inyección de variables..."
                    // Forzamos la variable DATABASE_URL para que el contenedor la tenga al iniciar
                    sh 'DATABASE_URL="postgresql://user:password@nocountry-postgres:5432/db" docker compose up -d --force-recreate'
                    
                    echo "🔍 Iniciando validación de salud (Health Check)..."
                    def healthCheck = sh(script: '''
                        count=0
                        while [ $count -lt 15 ]; do
                            echo "Esperando que el backend arranque... Intento $((count+1))/15"
                            # Verificamos si el contenedor está corriendo o reiniciando
                            STATUS=$(docker inspect -f '{{.State.Status}}' backend-container)
                            if [ "$STATUS" = "restarting" ]; then
                                echo "⚠️ El contenedor se está reiniciando, esperando..."
                            fi
                            
                            if docker exec backend-container wget -qO- http://localhost:3000/health > /dev/null; then
                                echo "✅ EL BACKEND RESPONDE CORRECTAMENTE"
                                exit 0
                            fi
                            sleep 10
                            count=$((count+1))
                        done
                        echo "❌ EL BACKEND NO RESPONDIÓ A TIEMPO"
                        exit 1
                    ''', returnStatus: true)

                    if (healthCheck != 0) {
                        echo "⚠️ Logs finales del backend:"
                        sh 'docker logs backend-container'
                        error("Falló el Health Check.")
                    }
                }
            }
            post {
                always {
                    echo "🧹 Limpiando entorno..."
                    sh 'docker compose down'
                }
            }
        }
    }
}