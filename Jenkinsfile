pipeline {
    agent none 

    triggers {
        githubPush()
    }

    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    // Quitamos el changeset temporalmente para que SIEMPRE corra en tu rama y veamos si pasa
                    when { branch 'feature/jenkins' } 
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
                    when { branch 'feature/jenkins' }
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
            when { branch 'feature/jenkins' }
            agent {
                docker {
                    image 'docker:latest' 
                    // Agregamos --entrypoint para evitar el error que te salió
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
                }
            }
            steps {
                script {
                    echo "🚀 Levantando entorno de integración..."
                    sh 'docker compose down --remove-orphans || true'
                    sh 'docker compose up -d --build --force-recreate'
                    
                    echo "🔍 Esperando 20 segundos..."
                    sh 'sleep 20'
                    
                    sh 'docker ps'
                    
                    echo "📄 LOGS DEL BACKEND:"
                    // Usamos || true para que si el contenedor no existe no rompa el pipeline
                    sh 'docker logs backend-container || true'
                    
                    sh 'docker compose down'
                }
            }
        }
    }
    
    // Eliminamos el cleanWs global que causaba el crash
}