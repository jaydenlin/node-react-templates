var fs = require('fs');
var reactTemplates=require("react-templates/src/reactTemplates");
var requireFromString = require('require-from-string');

var installed = false;

function installType(opt){
  if(opt===null || opt.type === "file"){
    install();
  }else{
    return compileWithString;
  }
}

function install() {
  if (installed) {
    return;
  }

  require.extensions['.rt'] = function(module, filename) {
    
    var source = fs.readFileSync(filename, {encoding: 'utf8'});
    
    try {  
      source = reactTemplates.convertTemplateToReact(source,{modules: 'commonjs', name: 'template'});

    } catch (e) {
      throw new Error('Error transforming ' + filename + ' to React: ' + e.toString());
    }
    module._compile(source, filename);
  };

  installed = true;
}

function compileWithString (source, opt) {
  if(opt === null || {}){
    opt = {modules: 'commonjs', name: 'template'};
  }
  try{
    source = reactTemplates.convertTemplateToReact(source, opt);
    var component = requireFromString(source);
    return component;
  } catch(e) {
    throw new Error('Error transforming ' + source + ' to React: ' + e.toString());
  }
}

module.exports = {
  install: installType
};