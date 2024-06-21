import autoLaunch from "auto-launch";

function AutoLaunch(app, start) {
  const laucher = new autoLaunch({
    name: app.getName(),
    path: app.getPath("exe"),
  });
  if (start) laucher.enable();
  else laucher.disable();
}

export { AutoLaunch };
