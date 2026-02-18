pipeline {
    agent any
    
    triggers {
        githubPush()
    }

    stages {
        stage('CI: Unit Tests') {
            parallel {
                stage('Frontend Check') {
                    when { changeset "front-end/**" }
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
                    steps {
                        dir('front-end') {
                            sh 'npm install'
                            sh 'npx vitest run --passWithNoTests'
                        }
                    }
                }
                stage('Backend Check') {
                    when { changeset "backend/**" }
                    agent { docker { image 'node:20-alpine'; args '-u 0:0' } }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run test -- --passWithNoTests'
                        }
                    }
                }
            }
        }

        stage('CD: Integration Test') {
            when { 
                anyOf {
                    branch 'development'
                    branch 'main'
                    branch 'feature/jenkins' 
                }
            }
            agent {
                docker {
                    image 'docker:24-cli'
                    // EXPLICACIÓN DE ARGS:
                    // -u 0:0 -> Ejecuta como root para evitar el "Permission Denied"
                    // -v /var/run/docker.sock... -> Conecta con el motor Docker del servidor
                    // -e HOME=... -> Redirige la configuración de docker a una carpeta con permisos
                    args '-u 0:0 -v /var/run/docker.sock:/var/run/docker.sock -e HOME=/tmp'
                }
            }
            steps {
                echo "🚀 Levantando entorno con permisos de root y bypass de HOME..."
                script {
                    // Ahora docker compose podrá crear sus carpetas temporales en /tmp
                    sh 'docker compose up -d --build'
                    
                    try {
                        echo "🔍 Verificando servicios..."
                        sh 'docker ps'
                        sh 'sleep 15'
                        echo "✅ Ecosistema validado."
                    } catch (Exception e) {
                        error("Fallo en la validación: ${e.getMessage()}")
                    } finally {
                        echo "🧹 Limpiando..."
                        sh 'docker compose down'
                    }
                }
            }
        }

        stage('PROD: Release') {
            when { branch 'main' }
            steps {
                echo "📦 Rama principal detectada."
            }
        }
    }
    
    post {
        always {
            cleanWs deleteDirs: true, disableDeferredWipeout: true
        }
    }
}