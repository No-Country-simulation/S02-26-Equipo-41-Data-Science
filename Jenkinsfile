pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        stage('Análisis y Tests (CI)') {
            parallel {
                stage('Frontend') {
                    when { changeset "front-end/**" }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0' 
                        } 
                    }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend') {
                    when { changeset "backend/**" }
                    agent { 
                        docker { 
                            image 'node:20-alpine'
                            args '-u 0:0' 
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
                    dir('backend') {
                        sh 'docker build -t s02-backend:test .'
                    }
                    dir('front-end') {
                        sh 'docker build -t s02-frontend:test .'
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ ¡Todo pasó perfectamente!"
        }
        failure {
            echo "❌ Algo falló. Revisa los logs arriba."
        }
        always {
            // Limpieza robusta para evitar errores de permisos en Windows/Docker
            cleanWs deleteDirs: true, disableDeferredWipeout: true
            echo "Pipeline finalizado en ${env.BRANCH_NAME}"
        }
    }
}