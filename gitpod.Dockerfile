# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-base:2024-04-03-08-50-41

USER root

# Install custom tools, runtime, etc.
RUN set -e \
    && apt update \
    && apt install -y software-properties-common \
    && add-apt-repository -y ppa:ubuntu-toolchain-r/test \
    && apt update \
    && apt install -y tmux vim autoconf build-essential curl gettext git locales pkg-config rsync libffi-dev python3 python3-dev python3-venv maven npm golang-1.18 ninja-build ccache gcc-13 g++-13 file patchelf \
    && locale-gen en_US.UTF-8 \
    && mkdir /opt/yb-build \
    && chown gitpod /opt/yb-build 

USER gitpod
RUN set -e \
    && mkdir ~/tools \
    && curl -L "https://github.com/Kitware/CMake/releases/download/v3.25.2/cmake-3.25.2-linux-x86_64.tar.gz" | tar xzC ~/tools \
    && export PATH="$HOME/tools/cmake-3.25.2-linux-x86_64/bin:/usr/lib/go-1.18/bin:$PATH" \
    && echo 'export PATH="$HOME/tools/cmake-3.25.2-linux-x86_64/bin:/usr/lib/go-1.18/bin:$PATH"' >> ~/.bashrc

