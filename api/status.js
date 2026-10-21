// Vercel Serverless Function: Train Tracker API & Health Status
export default function handler(req, res) {
  const { train = "49007" } = req.query;
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

  const trains = {
    "49002": {
      trainNo: "49002",
      name: "Chengalpattu - Chennai Egmore AC EMU Fast",
      route: "CGL -> MS",
      direction: "up",
      depTime: "07:50",
      arrTime: "09:12",
      primaryPlatformOrigin: "4",
      primaryPlatformDest: "11"
    },
    "49007": {
      trainNo: "49007",
      name: "Chennai Beach - Chengalpattu AC EMU Fast",
      route: "MS -> CGL",
      direction: "down",
      depTime: "18:27",
      arrTime: "19:50",
      primaryPlatformOrigin: "10",
      primaryPlatformDest: "5"
    }
  };

  const selected = trains[train] || trains["49007"];

  return res.status(200).json({
    status: "ok",
    service: "Chennai AC Local Commuter Assistant",
    train: selected,
    timestamp: new Date().toISOString(),
    deployment: "Vercel Serverless Edge",
    version: "2.0.0"
  });
}
