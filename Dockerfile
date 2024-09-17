FROM marlinorg/nitro-cli

WORKDIR /app/setup

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

COPY setup/ ./

ENTRYPOINT ["/app/setup/entrypoint.sh"]