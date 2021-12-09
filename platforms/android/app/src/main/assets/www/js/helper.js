function getCategoryNameByID(id){
    let categoryName;
    switch(id)  {
        case 1:
            break;
        case 2:
            categoryName = "אמונה"
            break;
        case 3:
            categoryName = "הלכה"
            break;
        case 4:
            categoryName = "פרשת שבוע"
            break;
    }

    return categoryName;
}


const objToMap = (obj => {
    const mp = new Map;
    Object.keys(obj).forEach (k => { mp.set(k, obj[k]) });
    return mp;
});

const mapToObj = (aMap => {
    const obj = {};
    aMap.forEach((v,k) => { obj[k] = v });
    return obj;
});

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.status != 200 || xhr.readyState != 4) return;
      callback(JSON.parse(xhr.responseText));
    }
    xhr.send();
  };

  function getJSONP(url, cb_name, cb) {
    var existing_cb = window[cb_name] || function(){};
    window[cb_name] = function() {
      try {
        cb.apply(this, arguments);
      } catch(err) {}
      existing_cb.apply(this, arguments);
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
  }
const endOfContentDiv = `<div id="endOfContent">תודה לרב גבריאל אלישע!<div>`;