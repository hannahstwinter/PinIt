document.addEventListener('DOMContentLoaded', function () {
  new PinIt().startItUp();
});

PinIt = function () {
  this.colors_ = ['blue', 'red', 'orange', 'green', 'purple'];
};

PinIt.prototype.startItUp = function () {
  for (var i = 0; i < this.colors_.length; i++) {
    new ListPin(this.colors_[i]);
  }

  this.registerListeners_();

  // this is where you create a pin / pin and note object for the UI from local storage
  // register listener on window storage (possible?) and update here only, !(here && page.js)

  this.getTabData_(this, function (that, tab) {
    url = tab.url;
    that.pin_ = window.localStorage.getItem( String(url) );
  });
};

PinIt.prototype.getTabData_ = function (that, callback) {
  chrome.tabs.query(
    {
      'currentWindow': true,
      'active': true,
      'status': 'complete',
      'windowType': 'normal'
    }, function (tabs) {
      callback(that, tabs[0]);
    }
  );
};

PinIt.prototype.registerListeners_ = function () {
  $("#list-current-page-pins").click(function () {
    $("#current-page-pins-list").slideToggle();
  });

  $("#list-all-pins").click(function () {
    $("#all-pages-pins-list").slideToggle();
  });
};

PinIt.prototype.colors_ = [];

ListPin = function (color) {
  this.addPinToList_(color);
  this.addPinListeners_(color);
};

ListPin.prototype.addPinToList_ = function (color) {
  var html;

  html = document.createElement('div');
  html.classList.add('pin-container');

  html.innerHTML = this.getTemplate_(color);

  document.getElementById('color-pins-to-select').appendChild(html);
};

ListPin.prototype.getTemplate_ = function (color) {
  var html;

  html = "<img src='images/" + color + "_pin_icon.png'" +
    "class='color-pin' id='" + color + "-pin'>" +
    "<img src='images/plus-plus.png' class='plus-icon'" +
    "id='" + color + "-plus'></img>";

  return html;
};

ListPin.prototype.addPinListeners_ = function (color) {
  var pinElement, plusElement;

  pinElement = document.getElementById(color + '-pin');
  plusElement = document.getElementById(color + '-plus');

  plusElement.style.visibility="hidden";

  pinElement.addEventListener('mouseover', function () {
    pinElement.classList.add('show-plus');
    plusElement.style.visibility="visible";
  });

  pinElement.addEventListener('mouseout', function () {
    pinElement.classList.remove('show-plus');
    plusElement.style.visibility="hidden";
  });

  pinElement.addEventListener('click', function () {
    new PagePin(color);
  });
};

PagePin = function (color) {
  var withNote;

  withNote = document.getElementById('with-note-checkbox').checked;

  this.color_ = color;

  this.getTabData_(this, function (that, tab) {
    that.url_ = tab.url;
    that.tab_ = tab;

    var config = { url: tab.url, color: that.color_, note: withNote };

    chrome.tabs.executeScript(
      tab.id,
      { code: 'var config = ' + JSON.stringify(config) + '' },
      function () {
        chrome.tabs.executeScript(
          tab.id,
          { file: "page.js" },
          function (result) {
            // this.pinCoords_ = result;
          }
        );
      }
    );
  });
};

PagePin.prototype.getTabData_ = function (that, callback) {
  chrome.tabs.query(
    {
      'currentWindow': true,
      'active': true,
      'status': 'complete',
      'windowType': 'normal'
    }, function (tabs) {
      callback(that, tabs[0]);
    }
  );
};

PagePin.prototype.url_ = null;
PagePin.prototype.tab_ = null;
PagePin.prototype.color_ = '';

// window.localStorage.clear();

// TODO: configure for multiple pins, multiple pins for page
// if multiple pins, require a note for those?
// display abbreviated note for user to jump to specific pin
// have list of all pins on all pages that user can edit
// can use list to open a new tab for that page with pin, auto jump to pin
