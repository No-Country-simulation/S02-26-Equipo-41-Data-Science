pipeline {
    agent any
    stages {
        stage('Análisis y Tests (CI)') {
            parallel {
                stage('Frontend') {
                    agent { docker { image 'node:20-alpine' } }
                    steps {
                        dir('front-end') {
                            // Limpieza profunda para evitar errores de módulos
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                            sh 'npm run build --if-present'
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
            }
        }

        stage('Deploy to DEV') {
            when { branch 'development' }
            steps {
                echo "🚀 Desplegando en ambiente de DESARROLLO..."
                // Forzamos la recreación de los contenedores con el nuevo código
                sh 'docker compose up -d --build'
            }
        }
    }
    post {
        always {
            cleanWs()
            echo "Pipeline finalizado en ${env.BRANCH_NAME}"
        }
    }
}