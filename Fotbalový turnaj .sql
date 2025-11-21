CREATE TABLE `hrac` (
  `id_hrace` integer PRIMARY KEY NOT NULL,
  `id_aktualniho_tymu` interger NOT NULL,
  `jmeno` varchar(255),
  `prijmeni` varchar(255),
  `pohlavi` enum(muž,žena),
  `datum_narozeni` date,
  `pocet_golu` int,
  `pozice` enum(Brankář,Obránce,Záložník,Útočník)
);

CREATE TABLE `zapas` (
  `id_zapasu` integer PRIMARY KEY,
  `domaci_tym` integer,
  `hostujici_tym` integer,
  `cas_zapasu` timestamp,
  `domaci_goly` int,
  `hoste_goly` int
);

CREATE TABLE `tym` (
  `id_tymu` integer NOT NULL,
  `jmeno_tymu` varchar(255),
  `pocet_hracu` int
);

CREATE TABLE `hraci_v_zapase` (
  `id_hrace_v_poli` integer NOT NULL,
  `id_zapasu` integer NOT NULL,
  `odehrane_minuty` int
);

CREATE TABLE `udalosti` (
  `id_udalosti` integer PRIMARY KEY,
  `id_zapasu` integer NOT NULL,
  `id_hrace` integer NOT NULL,
  `minuta` int,
  `typ` enum(gól,žlutá karta,červená karta,střídání),
  `popisek` varchar(255),
  `stridajici_hrac` integer
);

CREATE TABLE `prestup` (
  `id_prestupu` integer PRIMARY KEY AUTO_INCREMENT,
  `id_hrace` integer NOT NULL,
  `id_noveho_tymu` integer NOT NULL,
  `datum` date
);

ALTER TABLE `udalosti` ADD FOREIGN KEY (`id_hrace`) REFERENCES `hrac` (`id_hrace`);

ALTER TABLE `zapas` ADD FOREIGN KEY (`id_zapasu`) REFERENCES `udalosti` (`id_zapasu`);

ALTER TABLE `tym` ADD FOREIGN KEY (`id_tymu`) REFERENCES `zapas` (`domaci_tym`);

ALTER TABLE `tym` ADD FOREIGN KEY (`id_tymu`) REFERENCES `zapas` (`hostujici_tym`);

ALTER TABLE `tym` ADD FOREIGN KEY (`id_tymu`) REFERENCES `hrac` (`id_aktualniho_tymu`);

ALTER TABLE `prestup` ADD FOREIGN KEY (`id_hrace`) REFERENCES `hrac` (`id_hrace`);

ALTER TABLE `tym` ADD FOREIGN KEY (`id_tymu`) REFERENCES `prestup` (`id_noveho_tymu`);

ALTER TABLE `hraci_v_zapase` ADD FOREIGN KEY (`id_hrace_v_poli`) REFERENCES `udalosti` (`id_hrace`);

ALTER TABLE `hraci_v_zapase` ADD FOREIGN KEY (`id_zapasu`) REFERENCES `udalosti` (`id_zapasu`);
