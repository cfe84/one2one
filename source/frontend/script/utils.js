var get = (url, callback) => {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', url);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      var res = JSON.parse(this.responseText);
      callback(null, res);
    }
  };
  xhttp.send();
}

var loadComponent = (componentName, loadOnId, callback) => {
  var componentUrl = `/components/${componentName}.html`;
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', componentUrl);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      var componentContent = this.responseText;
      setElementById(loadOnId, componentContent);
      if (callback)
        callback();
    }
  };
  xhttp.send();
};

var setElementsByName = (name, value) => {
  var elements = document.getElementsByName(name);
  for (i = 0; i < elements.length; i++)
    elements[i].innerHTML = value;
};

var setElementById = (id, value) => {
  document.getElementById(id).innerHTML = value;
};

var html = (elementName, content, options) => {
  var flattenedOptions = "";
  if (options)
    for (key in options)
      flattenedOptions += ` ${key}="${options[key]}"`;
  var element = `<${elementName}${flattenedOptions}>${content}</${elementName}>`;
  return element;
};

html.LIST_ELEMENT = "li";
html.DIV = "div";