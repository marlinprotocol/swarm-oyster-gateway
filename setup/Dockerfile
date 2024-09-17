FROM alpine:3.17

RUN apk add --no-cache net-tools iptables iproute2 wget

WORKDIR /app

RUN wget -O supervisord http://public.artifacts.marlin.pro/projects/enclaves/supervisord_master_linux_arm64 && chmod +x supervisord
RUN wget -O ip-to-vsock-transparent http://public.artifacts.marlin.pro/projects/enclaves/ip-to-vsock-transparent_v1.0.0_linux_arm64 && chmod +x ip-to-vsock-transparent
RUN wget -O keygen http://public.artifacts.marlin.pro/projects/enclaves/keygen_v1.0.0_linux_arm64 && chmod +x keygen
RUN wget -O attestation-server http://public.artifacts.marlin.pro/projects/enclaves/attestation-server_v1.0.0_linux_arm64 && chmod +x attestation-server
RUN wget -O vsock-to-ip http://public.artifacts.marlin.pro/projects/enclaves/vsock-to-ip_v1.0.0_linux_arm64 && chmod +x vsock-to-ip
RUN wget -O dnsproxy http://public.artifacts.marlin.pro/projects/enclaves/dnsproxy_v0.46.5_linux_arm64 && chmod +x dnsproxy
RUN wget -O oyster-keygen http://public.artifacts.marlin.pro/projects/enclaves/keygen-secp256k1_v1.0.0_linux_arm64 && chmod +x oyster-keygen

COPY supervisord.conf /etc/supervisord.conf
COPY setup.sh ./
RUN chmod +x setup.sh

COPY server/ /app/server/

RUN apk add chromium git nodejs npm

ENTRYPOINT ["/app/setup.sh"]