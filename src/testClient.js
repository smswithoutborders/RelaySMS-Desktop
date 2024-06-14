import { createEntity } from "./grpcNode.js";

const phoneNumber = "12345";
const password = "your_password";

createEntity(
  { phone_number: phoneNumber, password: password },
  (err, response) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Response:", response);
    }
  }
);
