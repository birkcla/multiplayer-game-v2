function hsvToRgb(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}



function rgbToHex(r, g, b) {
  let hexR = ('0' + parseInt(r, 10).toString(16)).slice(-2);
  let hexG = ('0' + parseInt(g, 10).toString(16)).slice(-2);
  let hexB = ('0' + parseInt(b, 10).toString(16)).slice(-2);
  return '#' + hexR + hexG + hexB;
}

function hsvToHex(h, s, v){
  rgb = hsvToRgb(h, s, v)
  hex = rgbToHex(rgb[0], rgb[1], rgb[2])
  return hex;
}