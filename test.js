import fs from "fs";

const EXPECTED = {
  teams: 10,
  players: 150,
  matches: 20
};

function check(ok, msg) {
  console.log((ok ? "✔️" : "❌") + " " + msg);
}

console.log("=== TEST START ===");

if (!fs.existsSync("fotbalovy_turnaj.sql")) {
  console.log("❌ Soubor fotbalovy_turnaj.sql neexistuje!");
  process.exit(1);
}

const sql = fs.readFileSync("fotbalovy_turnaj.sql", "utf8");

check(sql.includes("INSERT INTO tym"), "Obsahuje týmy");
check(sql.includes("INSERT INTO hrac"), "Obsahuje hráče");
check(sql.includes("INSERT INTO zapas"), "Obsahuje zápasy");
check(sql.includes("INSERT INTO hraci_v_zapase"), "Obsahuje hraci_v_zapase");
check(sql.includes("INSERT INTO udalosti"), "Obsahuje události");
check(sql.includes("INSERT INTO prestup"), "Obsahuje přestupy");

console.log("=== TEST END ===");
