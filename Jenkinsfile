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
                                # 1. Eliminamos rastro de instalaciones previas y el lock de Windows
                                rm -rf node_modules package-lock.json
                                
                                # 2. Instalación limpia para el entorno Linux de Jenkins
                                npm install
                                
                                # 3. Variable ficticia obligatoria para que Prisma no falle
                                export DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"
                                
                                # 4. Generación del cliente de Prisma
                                npx prisma generate
                                
                                # 5. Ejecución de tests (ahora debería encontrar ts-jest sin problemas)
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