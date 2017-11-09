var hash_crypto_val = require("crypto");
var fs = require('fs');

//sha for a string
function getHash_Checksum(file, algorithm, encoding) {
  var algo = 'SHA256';
  console.log(algo);
  var sha_check_sum = hash_crypto_val.createHash(algo);
  var file_stream = fs.ReadStream(file);
  file_stream.on('data', function(d) { sha_check_sum.update(d); });
  file_stream.on('end', function() {
    d = sha_check_sum.digest('hex');
    //use this d as the SHA encrypted value for a file
    console.log(d);

  });

}
getHash_Checksum(filepath);
