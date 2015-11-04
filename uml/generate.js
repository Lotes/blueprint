var fs = require('fs');
var exec = require('child_process').exec;

function generate(scriptPath, imagePath) {
  console.log('generating "'+imagePath+'"...');
  exec('puml generate '+scriptPath+' -o '+imagePath);
}

var files = fs.readdirSync('.');
files.forEach(function(file){
  file = './'+file;
  if(!/\.puml$/.test(file))
    return;
  var png = file + '.png';
  if(!fs.existsSync(png))
    return generate(file, png);
  var scriptTime = fs.statSync(file).mtime;
  var imageTime = fs.statSync(png).mtime;
  if(scriptTime > imageTime)
    generate(file, png);
});