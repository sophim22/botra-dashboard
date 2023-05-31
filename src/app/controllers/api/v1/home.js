// import { validationResult } from "express-validator";
// import ContactRequest from "~/app/models/ContactRequest";
// import Page from "~/app/models/Page";
// import { errorSerialize } from "~/app/validations/api/contact";
// import { groupBy } from "~/app/helper/utils";
// import { sendContactRequest } from "~/app/mailer/contact_request";
// import Setting from "~/app/models/Configurations";

export const index = async (req, res) => {
  res.status(200).json({ data: "Hello Home" });
};

// export const terms = async (req, res) => {
//   const page = await Page.query().findOne({ code: "terms" }).select("content", "code");
//   res.status(200).json({ data: page });
// };

// export const configs = async (req, res) => {
//   const terms = await Page.query().findOne({ code: "terms" }).select("content", "code");
//   const privacy = await Page.query().findOne({ code: "privacy" }).select("content", "code");
//   const about = await Page.query().findOne({ code: "about" }).select("content", "code");

//   res.status(200).json({
//     data: {
//       terms,
//       privacy,
//       about,
//     },
//   });
// };

// export const contactRequest = async (req, res) => {
//   try {
//     const result = validationResult(req);
//     const errors = groupBy(result.errors, "param");
//     const errorsMessage = errorSerialize(errors);

//     if (result.errors.length) {
//       return res.status(400).json(errorsMessage);
//     }
//     await ContactRequest.query().insert(req.body);
//     // TODO SEND EMAIL
//     const contactEmail = await Setting.query().first()
//     sendContactRequest(contactEmail.shop_info.email,contactEmail.sms_templates.contact_request);
//     res
//       .status(200)
//       .json({ message: "Thank for your message.We will back to you as soon as possible please stay tune." });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: "Oop, sorry something went wrong!" });
//   }
// };
