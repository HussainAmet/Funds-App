import mongoose from "mongoose";
import express from "express";
import config from "./config/config.js"
import { userModel, memberDetailsModel } from "./schemas/index.js";
import cors from "cors";

const app = express();
const port = config.port || 3001;
app.use(express.json());
app.use(cors());

mongoose.connect(config.mongodUri, { dbName: "AssociationFunds" });

app.post(`${config.requestBaseUrl}login`, async (req, res) => {
  const number = req.body.phone;
  try {
    const userData = await userModel.findOne({"data.phone": number})
    if (userData) {
      if (userData.data.role === "host"){
        const member = await memberDetailsModel.findOne({ "data.auth": userData._id }, "data").populate("data.auth", "data");
        const members = await memberDetailsModel.find({}, "data").populate("data.auth", "data");
        res.send({member, members});
      } else if (userData.data.role === "member") {
        const member = await memberDetailsModel.findOne({ "data.auth": userData._id }, "data").populate("data.auth", "data");
        res.send({member});
      } else {
        res.send('');
      }
    } else {
      res.send('');
    }
  } catch (error) {
    throw error
  }
});

app.get(`${config.requestBaseUrl}add-member`, async (req, res) => {
  const name = "Murtaza Amet";
  const phone = 1234567890;
  try {
    const userData = await userModel.create({
      data: {
        name: name,
        phone: phone,
        role: "member",
      }
    })
    const newMember = await memberDetailsModel.create({
      data: {
        auth: userData._id,
        saving: 0,
        loanRemaing: 0,
      },
    })
    const member = await memberDetailsModel.findOne({ _id: newMember._id }, "data").populate("data.auth", "data")
    res.send(member.data);

  } catch (error) {
    res.send(error);
    throw error;
  }
});

app.get(`${config.requestBaseUrl}get-all-members`, async (req, res) => {
  try {
    const members = await memberDetailsModel.find({}, 'data').populate("data.auth", "data")
    res.send(members);
  } catch (error) {
    throw error;
  }
});

app.get(`${config.requestBaseUrl}update-member/:userId`, async (req, res) => {
  const userId = req.params.userId
  const date = new Date()
  const role = "admin"
  try {
    const memberUpdate = await memberDetailsModel.findOneAndUpdate(
      {
        "data.userId": userId,
      },
      {
        "metaData.lastUpdated": date,
        "metaData.created": date,
        "data.userId": userId,
        "data.role": role,
        "data.saving": saving || "",
        "data.loanRemaing": loanRemaing || "",
        "data.loanMonth": loanMonth || "",
        "data.savingDetails.0.amount": savingDetailsAmount || "",
        "data.savingDetails.0.month": savingDetailsMonth || "",
        "data.savingDetails.0.year": savingDetailsYear || "",
        "data.loanDetails.0.amount": loanDetailsAmount || "",
        "data.loanDetails.0.month": loanDetailsMonth || "",
        "data.loanDetails.0.year": loanDetailsYear || "",
      },
      {
        returnDocument: 'after',
        upsert: true,
      }
    )
    res.send(memberUpdate);
  } catch (error) {
    res.send(error)
  }
});

app.get(`${config.requestBaseUrl}delete-member/:id`, async (req, res) => {
  const id = req.params.id;
  try {
    const response = await userModel.deleteOne({_id: id})
    res.send(response);
  } catch (error) {
    throw error;
  }
});

app.get("/health-check", (req, res) => {
  try{
    res.status(200).send("ok")
  } catch (error) {
    res.status(500).send({error: error})
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// {name: 'Ummehani Cyclewala', savings: 37000,},
// {name: 'Fatema Amet', savings: 37000,},
// {name: 'Shabnam Amet', savings: 37000,},
// {name: 'Sakina Khilona', savings: 37000,},
// {name: 'Tasneem Rassa', savings: 37000,},
// {name: 'Jumana Amet', savings: 37000,},
// {name: 'Tasneem Bhadsora', savings: 37000,},
// {name: 'Rashida Pamalpur', savings: 37000,},
// {name: 'Jumana Gadi Saaz', savings: 37000,},
// {name: 'Shabana Amet', savings: 37000,},
// {name: 'Munira Amet', savings: 37000,},