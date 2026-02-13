pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Clonando repositorio...'
            }
        }

        stage('Build') {
            steps {
                echo '🔧 Simulando build...'
                sh 'echo "Compilando proyecto..."'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Ejecutando tests...'
                sh 'echo "Test 1 OK"'
                sh 'echo "Test 2 OK"'
            }
        }

        stage('Quality Gate') {
            steps {
                echo '🔍 Verificando calidad...'
                sh 'if [ -f error.txt ]; then exit 1; else echo "Sin errores"; fi'
            }
        }

        stage('Deploy (simulado)') {
            steps {
                echo '🚀 Desplegando aplicación (simulado)...'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completado con éxito'
        }
        failure {
            echo '❌ El pipeline falló'
        }
    }
}
