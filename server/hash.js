import bcrypt from "bcrypt";

const hash = await bcrypt.hash("rohith676", 10);
console.log(hash);