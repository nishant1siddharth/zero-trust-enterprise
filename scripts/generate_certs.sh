#!/bin/bash
# Generate Development Certificates for Zero Trust Enterprise Gateway

mkdir -p ../security
cd ../security

echo "Generating RSA private key and self-signed certificate for local development..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout gateway.key -out gateway.crt \
    -subj "/C=US/ST=State/L=City/O=ZeroTrustEnterprise/CN=localhost"

echo "Development certificates generated in the 'security' folder!"
echo "Note: These are self-signed and will throw a warning in browsers. This is expected for local simulation."
