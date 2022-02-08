echo Version number:
read version

docker build -t alexander171294/rustmon .
docker tag alexander171294/rustmon:latest alexander171294/rustmon:$version
docker push alexander171294/rustmon
docker push alexander171294/rustmon:$version

git tag $version
git push origin --tags