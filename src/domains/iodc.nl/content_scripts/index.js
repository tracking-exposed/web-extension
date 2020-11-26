
import { Hub } from "src/content_scripts/";

async function boot() {
  console.log(window.location);
  if(window.location.hostname !== 'www.iodc.nl') return;

  console.log(
    "%c on: iodc.nl",
    "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
  );

  /* tamper with the page interaction logic if the extension is present and handle the reserved classes|id */
  window.document.querySelectorAll(".mrTtextfield").forEach(function(node) {
    const m = node.innerHTML.match(/<br><br>[A-Z0-9]{8}<br><br>/);
    if(m) {
      const hub = new Hub();
      const exactId = m[0].substr(8, 8);
      console.log("spot Id!", exactId);
      hub.send("idMatch", exactId);
      node.innerHTML = node.innerHTML.replace(exactId, "Het activeren van de plug-in is gelukt!");
    }
  });

}

boot();
