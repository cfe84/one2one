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

var loadComponent = (componentName, loadOnId) => {
  var componentUrl = `/components/${componentName}.html`;
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', componentUrl);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      var componentContent = this.responseText;
      setFieldById(loadOnId, componentContent);
    }
  };
  xhttp.send();
};

var setFieldsByName = (name, value) => {
  var elements = document.getElementsByName(name);
  for (i = 0; i < elements.length; i++)
    elements[i].innerHTML = value;
};

var setFieldById = (id, value) => {
  document.getElementById(id).innerHTML = value;
};
