var hash_crypto_val = require("crypto");
var fs = require('fs');

exports.getHash_Checksum = function(file, algorithm, encoding) {
  console.log('Filepath'+file);
   return new Promise ((resolve, reject ) => {
  var algo = 'SHA256';
  var sha_check_sum = hash_crypto_val.createHash(algo);
  var file_stream = fs.ReadStream('.'+file);
  console.log('FileStream'+file_stream);
  file_stream.on('data', function(d) {
        console.log('data'+d);
    sha_check_sum.update(d);
  });
  file_stream.on('end', function() {
    var encryp = sha_check_sum.digest('hex');
    console.log('encryp'+encryp);
    resolve( encryp);
  });
  });
}
