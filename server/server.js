import mongoose from "mongoose";
import express from "express";
import config from "./config/config.js";
import {
  userModel,
  memberDetailsModel,
  totalSavingsModel,
} from "./schemas/index.js";
import cors from "cors";

const app = express();
const port = config.port || 3001;
app.use(express.json());

app.use(cors(
  // {
  //   origin: 'http://localhost:5173',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // }
));
// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

mongoose.connect(config.mongodUri, { dbName: "AssociationFunds" });

app.post(`${config.requestBaseUrl}login`, async (req, res) => {
  const number = String(req.body.phone);
  try {
    const userData = await userModel.findOne({ "data.phone": number });
    if (userData) {
      if (userData.data.active === true) {
        if (userData.data.role.includes("host")) {
          const member = await memberDetailsModel
            .findOne({ "data.auth": userData._id }, "data")
            .populate([
              { path: "data.totalSavings" },
              { path: "data.auth", select: "data" },
            ]);
          const members = await memberDetailsModel
            .find({ "data.active": true }, "data")
            .populate("data.auth", "data");
          res.status(200).send({
            member,
            members: members.sort((name1, name2) => {
              if (name1.data.auth.data.name < name2.data.auth.data.name) {
                  return -1;
              }
              if (name1.data.auth.data.name > name2.data.auth.data.name) {
                  return 1;
              }
              return 0;
            })
          });
        } else if (userData.data.role.includes("member")) {
          const member = await memberDetailsModel
            .findOne({ "data.auth": userData._id }, "data")
            .populate([
              { path: "data.totalSavings" },
              { path: "data.auth", select: "data" },
            ]);
          res.status(200).send({ member });
        } else {
          res.status(404).send("");
        }
      } else {
        res.status(404).send("");
      }
    } else {
      res.status(404).send("");
    }
  } catch (error) {
    throw error;
  }
});

app.post(`${config.requestBaseUrl}add-member`, async (req, res) => {
  const name = req.body.name;
  const phone = String(req.body.phone);
  try {
    const totalSavingsId = await totalSavingsModel.findOne({});
    const userData = await userModel.create({
      data: {
        name: name,
        phone: phone,
        role: ["member"],
        active: true,
      },
    });
    const newMember = await memberDetailsModel.create({
      data: {
        auth: userData._id,
        totalSavings: totalSavingsId._id,
        saving: 0,
        active: true,
      },
    });
    const member = await memberDetailsModel
      .findOne({ _id: newMember._id }, "data")
      .populate([
        { path: "data.totalSavings" },
        { path: "data.auth", select: "data" },
      ]);
    res.status(200).send(member);
  } catch (error) {
    res.status(409).send(error);
  }
});

app.post(`${config.requestBaseUrl}add-savings`, async (req, res) => {
  const userId = req.body.id;
  const amount = req.body.amount;
  const year = String(req.body.year);
  const month = String(req.body.month);
  const date = req.body.date;
  try {
    await memberDetailsModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        "metaData.lastUpdated": date,
        $inc: {
          "data.saving": amount,
        },
        $push: {
          "data.savingDetails": {
            amount: amount,
            month: month,
            year: year,
          },
        },
      }
    );
    await totalSavingsModel.findOneAndUpdate(
      {},
      {
        $inc: {
          totalSavings: amount,
        },
      }
    );
    res.status(200).send("ok");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post(`${config.requestBaseUrl}add-loan-installment`, async (req, res) => {
  const userId = req.body.id;
  const amount = req.body.amount;
  const year = String(req.body.year);
  const month = String(req.body.month);
  const date = req.body.date;
  try {
    const member = await memberDetailsModel.findOne({ _id: userId }, "data");
    if (member.data.loanRemaining === 0) {
      res.status(400).send("Member has no loan pending");
    } else if (member.data.loanRemaining < amount) {
      res.status(400).send("Entered amount is geater than loan remaining");
    } else {
      await memberDetailsModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          "metaData.lastUpdated": date,
          $inc: {
            "data.loanRemaining": -amount,
          },
          $push: {
            "data.loanDetails": {
              amount: amount,
              month: month,
              year: year,
            },
          },
        }
      );
      await totalSavingsModel.findOneAndUpdate(
        {},
        {
          $inc: {
            totalSavings: amount,
          },
        }
      );
      const updatedMember = await memberDetailsModel.findOne(
        { _id: userId },
        "data"
      );
      if (updatedMember.data.loanRemaining === 0) {
        await memberDetailsModel.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $unset: { "data.loanDate": 1, "data.loanRemaining": 1 },
          }
        );
      }
      res.status(200).send("ok");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post(`${config.requestBaseUrl}give-loan`, async (req, res) => {
  const userId = req.body.id;
  const amount = req.body.amount;
  const loanDate = req.body.loanDate;
  const date = req.body.date;
  try {
    const totalSavings = await totalSavingsModel.findOne({});
    if (totalSavings.totalSavings < amount) {
      res.status(400).send("Total savings are not that much");
    } else {
      await memberDetailsModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          "metaData.lastUpdated": date,
          $inc: {
            "data.loanRemaining": amount,
          },
          "data.loanDate": loanDate,
        }
      );
      await totalSavingsModel.findOneAndUpdate(
        {},
        {
          $inc: {
            totalSavings: -amount,
          },
        }
      );
      res.status(200).send("ok");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete(
  `${config.requestBaseUrl}delete-member/:id/:phone`,
  async (req, res) => {
    const phone = String(req.params.phone);
    const id = req.params.id;
    try {
      const auth = await userModel.findOne({ "data.phone": phone });
      const member = await memberDetailsModel.findOne({ _id: id });
      if (member.data.loanRemaining > 0) {
        res.status(400).send({ message: "Member has loan pending" });
      } else {
        const delDate = new Date();
        await userModel.findOneAndUpdate(
          { "data.phone": phone },
          { "data.deletedOn": delDate, "data.active": false, "data.phone": `${auth.data.phone} del ${delDate}` }
        );
        await memberDetailsModel.findOneAndUpdate(
          { _id: id },
          { "data.deletedOn": delDate, "data.active": false }
        );
        await totalSavingsModel.findOneAndUpdate(
          {},
          {
            $inc: {
              totalSavings: -member.data.saving,
            },
          }
        );
        res.status(200).send({ message: "ok", saving: member.data.saving });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

app.get("/health-check", (req, res) => {
  try {
    res.status(200).send("ok");
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// add admin api BEGIN

// app.post(`${config.requestBaseUrl}add-admin`, async (req, res) => {
//   const name = 'Hussain Amet';
//   const phone = '8739975253';
//   try {
//     const totalSavingsId = await totalSavingsModel.findOne({});
//     const userData = await userModel.create({
//       data: {
//         name: name,
//         phone: phone,
//         role: ["admin", "host"],
//         active: true,
//       },
//     });
//     const newMember = await memberDetailsModel.create({
//       data: {
//         auth: userData._id,
//         totalSavings: totalSavingsId._id,
//         saving: 0,
//         active: true,
//       },
//     });
//     const member = await memberDetailsModel
//       .findOne({ _id: newMember._id }, "data")
//       .populate([
//         { path: "data.totalSavings" },
//         { path: "data.auth", select: "data" },
//       ]);
//     res.status(200).send(member);
//   } catch (error) {
//     res.status(409).send(error);
//   }
// });

// add admin api END

// add manual data BEGIN

// import authDetailsData from '../Association_Funds_New_Data/associationFunds-authDetails.json' assert { type: 'json' }
// import membersData from '../Association_Funds_New_Data/associationFunds-members.json' assert { type: 'json' }

// app.post(`${config.requestBaseUrl}add-manual-data`, async (req, res) => {
//   try {
//     const totalSavingsId = await totalSavingsModel.findOne({});
//     authDetailsData.map(async(authDetailData, index) => {
//       const userData = await userModel.create({
//         data: authDetailData.data
//       });
//       await memberDetailsModel.create({
//         data: {
//           auth: userData._id,
//           totalSavings: totalSavingsId._id,
//           saving: Number(membersData[index].data.saving),
//           active: true,
//           savingDetails: membersData[index].data.savingDetails,
//           loanDetails: membersData[index].data.loanDetails,
//           loanDate: String(membersData[index].data.loanDate),
//           loanRemaining: Number(membersData[index].data.loanRemaining),
//         },
//       })
//     })
//     res.status(200).send('ok');
//   } catch (error) {
//     res.status(409).send(error);
//   }
// });

// add manual data END

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
