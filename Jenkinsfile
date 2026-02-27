pipeline {
<<<<<<< HEAD
<<<<<<< Updated upstream
    agent any
    
    triggers {
        githubPush()
    }

=======
    agent none 
    triggers { githubPush() }
    
>>>>>>> Stashed changes
=======
    agent none 
    triggers { githubPush() }
    
>>>>>>> 0273c1a85eda11b5c658c1955da4f9f76d04da13
    stages {
        stage('CI: Unit Tests') {
            parallel {
<<<<<<< HEAD
<<<<<<< Updated upstream
                stage('Frontend') {
                    // Solo corre si hay cambios en la carpeta front-end
                    when { changeset "front-end/**" }
                    agent { docker { image 'node:20-alpine' args '-u 0:0' } }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend') {
                    // Solo corre si hay cambios en la carpeta backend
                    when { changeset "backend/**" }
                    agent { docker { image 'node:20-alpine' args '-u 0:0' } }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
=======
                stage('Frontend Check') {
                    when { branch 'development' }
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
                    steps { 
                        dir('front-end') { 
                            sh 'npm install && npx vitest run --passWithNoTests' 
                        } 
                    }
                }
                stage('Backend Check') {
                    when { branch 'development' }
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
=======
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
>>>>>>> 0273c1a85eda11b5c658c1955da4f9f76d04da13
                    steps { 
                        dir('backend') { 
                            // CORRECCIÓN: Se agrega npx prisma generate antes de los tests
                            sh 'npm install && npx prisma generate && npm run test -- --passWithNoTests' 
                        } 
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 0273c1a85eda11b5c658c1955da4f9f76d04da13
                    }
                }
            }
        }

<<<<<<< HEAD
<<<<<<< Updated upstream
        stage('Build & Validate Images') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'feature/jenkins'
=======
        stage('CD: Integration Test & Health Check') {
            when { branch 'development' }
            agent {
                docker {
                    image 'docker:latest' 
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
>>>>>>> Stashed changes
=======
        stage('CD: Integration Test & Health Check') {
            agent {
                docker {
                    image 'docker:latest'
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock'
>>>>>>> 0273c1a85eda11b5c658c1955da4f9f76d04da13
                }
            }
            steps {
                script {
<<<<<<< HEAD
<<<<<<< Updated upstream
                    // Validamos Backend
                    dir('backend') {
                        sh 'docker build -t s02-backend:test .'
                    }
                    // Validamos Frontend
                    dir('front-end') {
                        sh 'docker build -t s02-frontend:test .'
=======
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
>>>>>>> 0273c1a85eda11b5c658c1955da4f9f76d04da13
                    }
=======
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
>>>>>>> Stashed changes
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