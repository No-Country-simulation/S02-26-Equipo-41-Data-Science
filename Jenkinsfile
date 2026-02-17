pipeline {
    agent any
    
    // Disparador para que GitHub avise a Jenkins
    triggers {
        githubPush()
    }

    stages {
        stage('Análisis y Tests (CI)') {
            parallel {
                stage('Frontend') {
                    agent { docker { image 'node:20-alpine' } }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend') {
                    agent { docker { image 'node:20-alpine' } }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
                    }
                }
                // NUEVO: Bloque de Data Science para tu prueba
                stage('Data Science') {
                    agent { docker { image 'python:3.9-slim' } }
                    steps {
                        script {
                            // Si aún no creas la carpeta, esto evitará que falle
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

        stage('Deploy to DEV') {
            // Se ejecutará en 'development' O cuando estés probando en 'feature/jenkins'
            when { 
                anyOf {
                    branch 'development'
                    branch 'feature/jenkins'
                }
            }
            steps {
                echo "🚀 Desplegando ambiente de prueba desde ${env.BRANCH_NAME}..."
                sh 'docker compose up -d --build'
            }
        }
    }
    
    post {
        success {
            echo "✅ ¡Todo pasó perfectamente! Listo para el Pull Request."
        }
        failure {
            echo "❌ Algo falló. Revisa los logs arriba. El PR quedará bloqueado."
        }
        always {
            cleanWs()
            echo "Pipeline finalizado en ${env.BRANCH_NAME}"
        }
    }
}