// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import connectToDatabase from "@/api/lib/db";
// import Locations from "@api/model/location";

// export default async function handler(req, res) {
//   await connectToDatabase();
//   const { method } = req;
//   switch (method) {
//     case "POST":
//       const { mobNum } = req.body;
//       try {
//         const checkDatas = await Chats.find({ mobNum });
//         // res.status(200).json({ status: "ok", message: checkDatas });
//         if (checkDatas) {
//           return res.status(200).json({
//             status: "ok",
//             message: "already created",
//           });
//         }
//         const response = await Locations.create(req.body);
//         res.status(200).json({ status: "ok", message: response });
//       } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//       break;
//     case "GET":
//       const { lat, long } = req.query;

//       try {
//         const response = await Locations.find({});
//         const chatIDs = [lat, long];

//         const filteredChats = response.find((i) =>
//           chatIDs.every((id) => i.sender == id || i.receiver == id)
//         );

//         if (filteredChats) {
//           return res.status(200).json({ status: "ok", data: filteredChats });
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     default:
//       res.status(405).json({ error: "Method Not Allowed" });
//       break;
//   }
// }
