#!/bin/bash

echo "Content-Type: text/plain"
echo
echo "System:"
uname -a
echo
echo "Limits:"
ulimit -a
echo
echo "Installed dotnet:"
command -v dotnet || true
dotnet --list-runtimes 2>&1 || true
echo
echo "OpenSSL:"
openssl version -a 2>&1 || true
ldconfig -p 2>/dev/null | grep -E 'libssl|libcrypto' || true
echo
echo "Private OpenSSL dependencies:"
LD_LIBRARY_PATH="/home/behforma/tienda.behformas.com/native" \
  ldd /home/behforma/tienda.behformas.com/native/libssl.so.3 2>&1 || true
LD_LIBRARY_PATH="/home/behforma/tienda.behformas.com/native" \
  ldd /home/behforma/tienda.behformas.com/native/libcrypto.so.3 2>&1 || true
