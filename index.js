var fs = require('fs');
var reactTemplates=require("react-templates/src/reactTemplates");

var installed = false;

function install() {
  if (installed) {
    return;
  }

  require.extensions['.rt'] = function(module, filename) {
    
    var source = fs.readFileSync(filename, {encoding: 'utf8'});
    
    try {  
      source = reactTemplates.convertTemplateToReact(source,{modules: 'commonjs', name: 'template'});

    } catch (e) {
      throw new Error('Error transforming ' + filename + ' to JS: ' + e.toString());
    }
    module._compile(source, filename);
  };

  installed = true;
}

module.exports = {
  install: install
};