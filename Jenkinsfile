pipeline {
    agent none 
    triggers { githubPush() }
    
    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
                    steps { 
                        dir('front-end') { 
                            sh 'npm install && npx vitest run --passWithNoTests' 
                        } 
                    }
                }
                stage('Backend Check') {
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
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
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
                }
            }
            steps {
                script {
                    echo "🧹 Limpiando imágenes previas y forzando build sin caché..."
                    
                    // Bajamos todo y eliminamos volúmenes huérfanos
                    sh 'docker compose down --remove-orphans || true'
                    
                    // Forzamos el build sin usar capas guardadas para evitar el error del dist/main
                    sh 'docker compose build --no-cache backend'
                    
                    // Levantamos el entorno
                    sh 'docker compose up -d --force-recreate'
                    
                    echo "🔍 Iniciando validación técnica (Health Check)..."
                    
                    def healthCheck = sh(script: '''
                        count=0
                        while [ $count -lt 12 ]; do
                            echo "Probing http://localhost:3000/health... (Intento: $((count+1)))"
                            # Intentamos conectar al endpoint de salud
                            if docker exec backend-container wget -qO- http://localhost:3000/health > /dev/null; then
                                echo "✅ VALIDACIÓN EXITOSA: El backend está online."
                                exit 0
                            fi
                            sleep 5
                            count=$((count+1))
                        done
                        echo "❌ ERROR: El Health Check falló tras 60 segundos."
                        exit 1
                    ''', returnStatus: true)

                    if (healthCheck != 0) {
                        echo "📄 LOGS DE EMERGENCIA (Backend):"
                        sh 'docker logs backend-container'
                        
                        echo "📂 ESTADO DE LA CARPETA DIST:"
                        // Esto nos dirá si el archivo main.js existe realmente o si está en otra subcarpeta
                        sh 'docker exec backend-container ls -R /app/dist || echo "La carpeta /app/dist no existe"'
                        
                        error("El test de integración falló: el servicio no está saludable o el archivo main.js no existe.")
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