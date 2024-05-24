echo Version number:
read version

docker build --platform linux/amd64 -t alexander171294/rustmon ./rustmon
docker tag alexander171294/rustmon:latest alexander171294/rustmon:$version
docker push alexander171294/rustmon
docker push alexander171294/rustmon:$version

docker build --platform linux/amd64 -t alexander171294/rustmon-service ./user-data-srv
docker tag alexander171294/rustmon-service:latest alexander171294/rustmon-service:$version
docker push alexander171294/rustmon-service
docker push alexander171294/rustmon-service:$version

git tag $version
git push origin --tags