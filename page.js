document.body.addEventListener(
  'click',
  function (event) {
    window.localStorage.setItem(
      String(config.url),
      '{x:' + String(event.pageX) + ',y:' + String(event.pageY) + ',color:' + config.color +
      ',note:' + config.note + ',text:""}'
    );

    console.log(window.localStorage);
  }
);
