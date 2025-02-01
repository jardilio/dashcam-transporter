# Note: You can use any Debian/Ubuntu based image you want. 
FROM mcr.microsoft.com/devcontainers/base:bullseye

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        nodejs \
        network-manager \
        smbclient -y

RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo bash - && sudo apt-get -y install nodejs