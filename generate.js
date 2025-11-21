import { faker } from "@faker-js/faker";
import fs from "fs";

// Kolik dat generovat
const TEAM_COUNT = 10;
const PLAYERS_PER_TEAM = 15;
const MATCH_COUNT = 20;

let sql = "";

// ------------------------------
// TÝMY
// ------------------------------
let teams = [];
sql += "-- TÝMY\n";
for (let i = 1; i <= TEAM_COUNT; i++) {
  const name = faker.company.name() + " FC";
  teams.push({ id: i, name });

  sql += `INSERT INTO tym VALUES (${i}, '${name}', ${PLAYERS_PER_TEAM});\n`;
}
sql += "\n";

// ------------------------------
// HRÁČI
// ------------------------------
let players = [];
sql += "-- HRÁČI\n";
let playerID = 1;

for (let team of teams) {
  for (let i = 0; i < PLAYERS_PER_TEAM; i++) {
    const jmeno = faker.person.firstName();
    const prijmeni = faker.person.lastName();
    const pohlavi = "muž";
    const narozeni = faker.date.birthdate({ min: 18, max: 35 }).toISOString().split("T")[0];
    const pozice = faker.helpers.arrayElement(["Brankář", "Obránce", "Záložník", "Útočník"]);
    const goly = faker.number.int({ min: 0, max: 20 });

    sql += `INSERT INTO hrac VALUES (${playerID}, ${team.id}, '${jmeno}', '${prijmeni}', '${pohlavi}', '${narozeni}', ${goly}, '${pozice}');\n`;

    players.push({ id: playerID, team: team.id });
    playerID++;
  }
}
sql += "\n";

// ------------------------------
// ZÁPASY
// ------------------------------
sql += "-- ZÁPASY\n";
let matches = [];

for (let i = 1; i <= MATCH_COUNT; i++) {
  let domaci = faker.number.int({ min: 1, max: TEAM_COUNT });
  let hoste = faker.number.int({ min: 1, max: TEAM_COUNT });

  // Ať nejsou stejné týmy proti sobě
  while (hoste === domaci) {
    hoste = faker.number.int({ min: 1, max: TEAM_COUNT });
  }

  const cas = faker.date.recent({ days: 100 }).toISOString().replace("T", " ").split(".")[0];

  const domaci_goly = faker.number.int({ min: 0, max: 5 });
  const hoste_goly = faker.number.int({ min: 0, max: 5 });

  sql += `INSERT INTO zapas VALUES (${i + 1000}, ${domaci}, ${hoste}, '${cas}', ${domaci_goly}, ${hoste_goly});\n`;

  matches.push({ id: i + 1000, domaci, hoste });
}
sql += "\n";

// ------------------------------
// HRÁČI V ZÁPASE (vybere náhodných 11 hráčů z týmu)
// ------------------------------
sql += "-- HRÁČI V ZÁPASE\n";

for (let match of matches) {
  const homePlayers = players.filter(p => p.team === match.domaci);
  const awayPlayers = players.filter(p => p.team === match.hoste);

  const selectedHome = faker.helpers.shuffle(homePlayers).slice(0, 11);
  const selectedAway = faker.helpers.shuffle(awayPlayers).slice(0, 11);

  for (let p of [...selectedHome, ...selectedAway]) {
    const minuty = faker.number.int({ min: 30, max: 90 });
    sql += `INSERT INTO hraci_v_zapase VALUES (${p.id}, ${match.id}, ${minuty});\n`;
  }
}
sql += "\n";

// ------------------------------
// UDÁLOSTI V ZÁPASE
// ------------------------------
sql += "-- UDÁLOSTI\n";
let eventID = 1;

for (let match of matches) {
  const hraci = players.filter(p => p.team === match.domaci || p.team === match.hoste);
  const eventCount = faker.number.int({ min: 1, max: 6 });

  for (let i = 0; i < eventCount; i++) {
    const hrac = faker.helpers.arrayElement(hraci).id;
    const minuta = faker.number.int({ min: 1, max: 90 });
    const typ = faker.helpers.arrayElement(["gól", "žlutá karta", "červená karta", "střídání"]);
    const popis = faker.lorem.sentence();

    sql += `INSERT INTO udalosti VALUES (${eventID}, ${match.id}, ${hrac}, ${minuta}, '${typ}', '${popis}', NULL);\n`;
    eventID++;
  }
}
sql += "\n";

// ------------------------------
// PŘESTUPY
// ------------------------------
sql += "-- PŘESTUPY\n";
for (let j = 0; j < 10; j++) {
  const hrac = faker.helpers.arrayElement(players);
  const newTeam = faker.number.int({ min: 1, max: TEAM_COUNT });

  sql += `INSERT INTO prestup VALUES (${j + 1}, ${hrac.id}, ${newTeam}, '${faker.date.past().toISOString().split("T")[0]}');\n`;
}

// Uložení do souboru
fs.writeFileSync("output.sql", sql);
console.log("output.sql byl úspěšně vygenerován!");
