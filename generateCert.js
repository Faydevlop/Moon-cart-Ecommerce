const { execSync } = require('child_process');
const fs = require('fs');

const generateCertificate = () => {
  // Generate a private key
  execSync('openssl genpkey -algorithm RSA -out ca-key.pem');

  // Generate a certificate signing request (CSR)
  execSync('openssl req -new -key ca-key.pem -out ca-csr.pem -subj "/CN=localhost"');

  // Self-sign the CSR to create the certificate
  execSync('openssl x509 -req -in ca-csr.pem -signkey ca-key.pem -out ca.pem');

  // Clean up intermediate files
  execSync('rm ca-csr.pem');

  console.log('Self-signed certificate generated successfully.');
};

generateCertificate();
