back=$(docker logs benzin_api)

while true
do
  if [ "$back" != "$(docker logs benzin_api)" ]; then
    echo $(docker logs benzin_api)
  fi
done
