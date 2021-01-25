pipeline {
    agent {
        dockerfile {
            filename 'infrastructure/docker/node.dockerfile'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=$(id -u jenkins) --build-arg JENKINS_GROUP_ID=$(id -g jenkins)'
        }
    }
    options {
        ansiColor('xterm')
    }
    stages {
        stage('Dependencies') {
            steps {
                sh 'yarn'
            }
        }
        stage('Test') {
            steps {
                // FIXME
                sh '''
                    echo "FIXME: yarn lint missing"
                    echo "FIXME: yarn test missing"
                '''
            }
        }
        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }
    }
}
