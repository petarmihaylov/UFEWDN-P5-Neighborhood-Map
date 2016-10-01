#!/usr/bin/env bash
# Save backups of FD's
exec 5>&1
exec 6>&2

start_seconds="$(date +%s)"
echo "Provisioning has started...	"

ping_result="$(ping -c 2 8.8.4.4 2>&1)"
if [[ $ping_result != *bytes?from* ]]; then
	echo "Network connection unavailable. Try again later."
    exit 1
fi

# log the output to files
echo "Self update apt-get"
# Redirect into files
exec 1>/vagrant/provision-stdout.log
exec 2>/vagrant/provision-stderr.log

apt-get update

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Installing curl"
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

apt-get install --assume-yes curl

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Installing git-core"
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

apt-get install --assume-yes git-core

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Installing required packages"
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

# Provides essential build tools
apt-get install --assume-yes build-essential
apt-get install --assume-yes python-software-properties
apt-get install --assume-yes software-properties-common

# Needed for nodejs.
curl -sL https://deb.nodesource.com/setup_4.x | bash -

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Installing Node.js..."
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

apt-get install --assume-yes nodejs
# nodejs above includes npm --- apt-get install -y npm

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Cleaning up"
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

apt-get autoremove --assume-yes
apt-get clean

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Downloading npm permission fix script..."
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

curl -sLo /vagrant/bootstrap.sh https://raw.githubusercontent.com/glenpike/npm-g_nosudo/master/npm-g-nosudo.sh
chmod +x /vagrant/bootstrap.sh

# Restore to terminal
exec 1>&5
exec 2>&6
echo "Setting up symlinks"
# Redirect into files
exec 1>>/vagrant/provision-stdout.log
exec 2>>/vagrant/provision-stderr.log

cd /home/vagrant/
ln -s /vagrant/bootstrap.sh bootstrap
chmod +x bootstrap
ln -s /vagrant/update-toolset.sh update-toolset
chmod +x update-toolset
ln -s /vagrant/update-toolset-gulp.sh update-toolset-gulp
chmod +x update-toolset-gulp

# Restore to terminal
exec 1>&5
exec 2>&6
end_seconds="$(date +%s)"
echo "-----------------------------"
echo "Provisioning complete in "$(expr $end_seconds - $start_seconds)" seconds"
echo "-----------------------------"
echo " "
echo "Remember to run:"
echo " "
echo "vagrant ssh"
echo "./bootstrap"
echo "source ~/.bashrc"
echo "./update-toolset"
echo " "
echo "This will move the npm root to the vagrant" 
echo "user's home directory and update Yeoman, Bower, and Grunt."
echo " "
