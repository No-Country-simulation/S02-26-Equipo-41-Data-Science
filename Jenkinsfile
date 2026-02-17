pipeline {
    agent any

    stages {
        stage('Análisis y Tests (CI)') {
            parallel {
                stage('Frontend Unit Tests') {
                    agent { docker { image 'node:20-alpine' } }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
                    }
                }
                stage('Backend Unit Tests') {
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

        // AMBIENTE DE DESARROLLO
        stage('Deploy to DEV') {
            when { branch 'development' }
            steps {
                echo "🚀 Desplegando en ambiente de DESARROLLO..."
                // Aquí podrías usar un docker-compose específico para dev
                sh 'docker compose up -d --build'
            }
        }

        // AMBIENTE DE STAGING / QA
        stage('Deploy to STAGING') {
            when { branch 'main' }
            steps {
                echo "🧪 Desplegando en ambiente de STAGING..."
                // Aquí podrías simular el deploy a un servidor de pruebas
                sh 'echo "Simulando deploy a Staging..."'
            }
        }
    }

    post {
        always {
            // Esto le avisa a GitHub el estado de CADA rama por separado
            step([$class: 'GitHubCommitStatusSetter', 
                  contextSource: [$class: 'DefaultCommitContextSource', context: "Jenkins/${env.BRANCH_NAME}"],
                  statusSource: [$class: 'AnyBuildResultStatusSource']
            ])
            cleanWs()
        }
    }
}