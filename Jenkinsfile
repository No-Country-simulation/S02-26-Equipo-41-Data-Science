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
                    // Quitamos el entrypoint aquí y lo manejamos en los args de forma más limpia
                    args '-u 0:0 --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                script {
                    // Tu lógica de docker-compose aquí está perfecta
                    sh 'docker compose down --remove-orphans || true'
                    sh 'docker compose build --no-cache backend'
                    sh 'docker compose up -d --force-recreate'
                    
                    // ... resto de tu script de Health Check
                }
            }
        }
    }
}