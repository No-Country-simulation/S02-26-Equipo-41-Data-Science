pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo "Clonando repositorio..."
                checkout scm
            }
        }

        stage('Lint') {
            steps {
                echo "Ejecutando lint..."
                sh 'echo "Simulando lint..."'
            }
        }

        stage('Test') {
            steps {
                echo "Ejecutando tests..."
                sh 'echo "Simulando tests..."'
            }
        }

        stage('Build') {
            steps {
                echo "Construyendo proyecto..."
                sh 'echo "Simulando build..."'
            }
        }
    }

    post {
        success {
            echo "Pipeline completado correctamente ✅"
        }
        failure {
            echo "Pipeline falló ❌"
        }
    }
}
