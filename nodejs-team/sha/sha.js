var hash_crypto_val = require("crypto");

//sha for a string
function getHash_Checksum(str, algorithm, encoding) {
  console.log(hash_crypto_val.createHash(algorithm ||'md5').update(str,'utf8').digest(encoding ||'hex'));
  return hash_crypto_val.createHash(algorithm ||'md5').update(str,'utf8').digest(encoding ||'hex');
}


getHash_Checksum('This is my sha implementation');
