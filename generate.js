import { faker } from "@faker-js/faker";
import fs from "fs";

const TEAM_COUNT = 10;
const PLAYERS_PER_TEAM = 15;
const MATCH_COUNT = 20;

let sql = "";

// --------------------------------------
// TÝMY
// --------------------------------------
let teams = [];
sql += "-- TÝMY\n";
for (let i = 1; i <= TEAM_COUNT; i++) {
  const name = faker.company.name() + " FC";
  teams.push({ id: i, name });

  sql += `INSERT INTO tym VALUES (${i}, '${name}', ${PLAYERS_PER_TEAM});\n`;
}
sql += "\n";

// --------------------------------------
// HRÁČI
// --------------------------------------
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

// --------------------------------------
// ZÁPASY
// --------------------------------------
sql += "-- ZÁPASY\n";
let matches = [];

for (let i = 1; i <= MATCH_COUNT; i++) {
  let domaci = faker.number.int({ min: 1, max: TEAM_COUNT });
  let hoste = faker.number.int({ min: 1, max: TEAM_COUNT });

  while (hoste === domaci) hoste = faker.number.int({ min: 1, max: TEAM_COUNT });

  const cas = faker.date.recent({ days: 50 }).toISOString().replace("T", " ").split(".")[0];
  const g1 = faker.number.int({ min: 0, max: 5 });
  const g2 = faker.number.int({ min: 0, max: 5 });

  sql += `INSERT INTO zapas VALUES (${i + 1000}, ${domaci}, ${hoste}, '${cas}', ${g1}, ${g2});\n`;
  matches.push({ id: i + 1000, domaci, hoste });
}
sql += "\n";

// --------------------------------------
// HRÁČI V ZÁPASE
// --------------------------------------
sql += "-- HRÁČI V ZÁPASE\n";

for (let match of matches) {
  const home = players.filter(p => p.team === match.domaci);
  const away = players.filter(p => p.team === match.hoste);

  const chosen = [
    ...faker.helpers.shuffle(home).slice(0, 11),
    ...faker.helpers.shuffle(away).slice(0, 11)
  ];

  for (let p of chosen) {
    sql += `INSERT INTO hraci_v_zapase VALUES (${p.id}, ${match.id}, ${faker.number.int({ min: 30, max: 90 })});\n`;
  }
}
sql += "\n";

// --------------------------------------
// UDÁLOSTI
// --------------------------------------
sql += "-- UDÁLOSTI\n";
let eventID = 1;

for (let match of matches) {
  const available = players.filter(p => p.team === match.domaci || p.team === match.hoste);
  const count = faker.number.int({ min: 1, max: 6 });

  for (let i = 0; i < count; i++) {
    const p = faker.helpers.arrayElement(available).id;
    const typ = faker.helpers.arrayElement(["gól", "žlutá karta", "červená karta", "střídání"]);

    sql += `INSERT INTO udalosti VALUES (
      ${eventID},
      ${match.id},
      ${p},
      ${faker.number.int({ min: 1, max: 90 })},
      '${typ}',
      '${faker.lorem.sentence()}',
      NULL
    );\n`;

    eventID++;
  }
}
sql += "\n";

// --------------------------------------
// PŘESTUPY
// --------------------------------------
sql += "-- PŘESTUPY\n";

for (let i = 1; i <= 10; i++) {
  const p = faker.helpers.arrayElement(players);
  const newTeam = faker.number.int({ min: 1, max: TEAM_COUNT });

  sql += `INSERT INTO prestup VALUES (${i}, ${p.id}, ${newTeam}, '${faker.date.past().toISOString().split("T")[0]}');\n`;
}

fs.writeFileSync("fotbalovy_turnaj.sql", sql);
console.log("✔ Soubor fotbalovy_turnaj.sql byl úspěšně vygenerován!");
