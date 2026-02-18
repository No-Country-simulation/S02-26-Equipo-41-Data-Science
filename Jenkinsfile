pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        stage('Análisis y Tests (CI)') {
            parallel {
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
                echo "🚀 Validando construcción de imágenes Docker..."
                script {
                    // Validamos Backend
                    dir('backend') {
                        sh 'docker build -t s02-backend:test .'
                    }
                    // Validamos Frontend
                    dir('front-end') {
                        sh 'docker build -t s02-frontend:test .'
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ ¡Todo pasó perfectamente! Frontend y Backend están validados."
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