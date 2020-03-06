# Copy the files across, not node_modules
rsync -r --exclude=node_modules ./ pi@goldilocks:~/goldilocks

# Ensure 'goldilocks' points to the pi. E.g. add it to /etc/hosts
# Add the next line to /etc/sudoers to allow passwordless reboot
# pi ALL=NOPASSWD:/sbin/reboot
ssh pi@goldilocks 'bash -s' < ./run.sh

# Todo fix 'error Command failed with exit code 255.' *shrug*