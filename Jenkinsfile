pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
            }
        }

        stage('Prueba simple') {
            steps {
                echo 'Hola Jenkins 🚀'
            }
        }

        stage('Mostrar archivos del repo') {
            steps {
                sh 'ls -la'
            }
        }

    }
}
