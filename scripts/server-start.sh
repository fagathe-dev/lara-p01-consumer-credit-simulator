#!/usr/bin/env bash
app_dir='/Users/fagathe/workspace/perso/lara-p01-consumer-credit-simulator'
app_host='dev.lara-p01-consumer-credit-simulator.fagathe-dev.fr'
port='8190'
db_driver='mysql'

# enregistrer le nouveau nom de domaine dans le host de la machine
# echo "127.0.0.1\t${app_host}" | sudo tee -a /etc/hosts

echo "lance le service ${db_driver}"
brew services start $db_driver
cd $app_dir
echo 'cd projet Laravel'
echo 'ouvrir le projet sur vscode'
code .

echo 'clear config/cache Laravel'
php artisan config:clear
php artisan cache:clear

echo "open http://${app_host}:${port} in browser"
# open http://$app_host:$port

# lance le worker de queue en arrière-plan (jobs vers l'API Python de scoring)
php artisan queue:work &
queue_pid=$!

# lance le serveur interne de Laravel (artisan serve)
php artisan serve --host=$app_host --port=$port

# stop le service DB et le worker de queue lorsqu'on stop le script
trap "kill $queue_pid; brew services stop ${db_driver}" EXIT