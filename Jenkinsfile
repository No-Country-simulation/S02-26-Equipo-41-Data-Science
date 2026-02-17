pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        stage('Análisis y Tests (CI)') {
            parallel {
                stage('Frontend') {
                    agent { docker { image 'node:20-alpine' 
                        args '-u 0:0' } 
                        }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend') {
                    agent { docker { image 'node:20-alpine' 
                        args '-u 0:0'} }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
                    }
                }
                stage('Data Science') {
                    agent { docker { image 'python:3.9-slim' } }
                    steps {
                        script {
                            if (fileExists('ml-service')) {
                                dir('ml-service') {
                                    sh 'pip install -r requirements.txt --quiet'
                                    sh 'python -m pytest'
                                }
                            } else {
                                echo "Pendiente: Crear carpeta ml-service con tests de Python"
                            }
                        }
                    }
                }
            }
        }

        stage('Build & Validate Images') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'feature/jenkins'
                }
            }
            steps {
                echo "🚀 Validando construcción de imágenes Docker (manual build)..."
                script {
                    // Validamos Backend
                    dir('backend') {
                        sh 'docker build -t s02-backend:test .'
                    }
                    // Validamos Frontend
                    dir('front-end') {
                        sh 'docker build -t s02-frontend:test .'
                    }
                    // Validamos ML-Service si existe
                    if (fileExists('ml-service')) {
                        dir('ml-service') {
                            sh 'docker build -t s02-ml:test .'
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ ¡Todo pasó perfectamente! Las imágenes construyen y los tests pasaron."
        }
        failure {
            echo "❌ Algo falló. Revisa los logs arriba."
        }
        always {
            cleanWs()
            echo "Pipeline finalizado en ${env.BRANCH_NAME}"
        }
    }
}