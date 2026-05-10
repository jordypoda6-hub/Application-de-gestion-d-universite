CREATE DATABASE IF NOT EXISTS `gestion_2ie` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gestion_2ie`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `anneeacademiques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `est_active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `civilites` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `civilites` (`id`, `libelle`, `abreviation`) VALUES
(1, 'Monsieur', 'M.'),
(2, 'Madame', 'Mme'),
(3, 'Mademoiselle', 'Mlle'),
(4, 'Docteur', 'Dr'),
(5, 'Professeur', 'Pr');

CREATE TABLE `cycles` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `duree_annees` int NOT NULL DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cycles` (`id`, `libelle`, `duree_annees`) VALUES
(1, 'Licence', 3),
(2, 'Master', 2),
(3, 'Doctorat', 3),
(4, 'DUT', 2),
(5, 'BTS', 2);

CREATE TABLE `decisions` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `decisions` (`id`, `libelle`, `description`) VALUES
(1, 'Admis', 'Étudiant admis'),
(2, 'Admis sous condition', 'Admis avec conditions supplémentaires'),
(3, 'Redoublant', 'Redoublant'),
(4, 'Refusé', 'Candidature refusée'),
(5, 'Inscrit', 'Étudiant inscrit'),
(6, 'Exclu', 'Étudiant exclu'),
(7, 'Diplômé', 'Étudiant diplômé');

CREATE TABLE `ecoles` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ecolesfilieres` (
  `ecoles_id` int NOT NULL,
  `filieres_id` int NOT NULL,
  `statut` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `dateOuverture` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `etudiants` (
  `id` int NOT NULL,
  `nom` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenoms` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays_id` int NOT NULL,
  `civilites_id` int NOT NULL,
  `dateNaissance` date DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `filieres` (
  `id` int NOT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `inscriptions` (
  `id` int NOT NULL,
  `etudiants_id` int NOT NULL,
  `parcours_id` int NOT NULL,
  `annee_academique_id` int NOT NULL,
  `decisions_id` int NOT NULL,
  `dateInscription` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `niveaux` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordre` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `parcours` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialites_id` int NOT NULL,
  `niveaux_id` int NOT NULL,
  `cycles_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pays` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationalite` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iso` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pays` (`id`, `libelle`, `nationalite`, `code`, `iso`) VALUES
(1, 'France', NULL, 'FRA', '0'),
(2, 'Belgique', NULL, 'BEL', '0'),
(3, 'Suisse', NULL, 'CHE', '0'),
(4, 'Canada', NULL, 'CAN', '0'),
(5, 'Sénégal', NULL, 'SEN', '0'),
(6, 'Côte d\'Ivoire', NULL, 'CIV', '0'),
(7, 'Maroc', NULL, 'MAR', '0'),
(8, 'Tunisie', NULL, 'TUN', '0');

CREATE TABLE `specialites` (
  `id` int NOT NULL,
  `libelle` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filieres_id` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `utilisateurs` (
  `id` int NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `utilisateurs` (`id`, `nom`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Administrateur', 'admin@2ie-edu.org', '$2b$10$cBz50VZ3uIEJn6dBNRC7qOtQJJfnUUYRorzq3CJCYMYK/Swb15HUK', 'admin', '2026-04-24 13:18:15');

ALTER TABLE `anneeacademiques`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `civilites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `cycles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `decisions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `ecoles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `ecolesfilieres`
  ADD PRIMARY KEY (`ecoles_id`,`filieres_id`),
  ADD KEY `fk_ecoles_filieres_filieres_idx` (`filieres_id`);

ALTER TABLE `etudiants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_etudiants_pays_idx` (`pays_id`),
  ADD KEY `fk_etudiants_civilites_idx` (`civilites_id`),
  ADD KEY `idx_etudiants_nom` (`nom`),
  ADD KEY `idx_etudiants_prenoms` (`prenoms`);

ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `inscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_inscriptions_etudiants_idx` (`etudiants_id`),
  ADD KEY `fk_inscriptions_parcours_idx` (`parcours_id`),
  ADD KEY `fk_inscriptions_annee_academique_idx` (`annee_academique_id`),
  ADD KEY `fk_inscriptions_decisions_idx` (`decisions_id`),
  ADD KEY `idx_inscriptions_date` (`dateInscription`);

ALTER TABLE `niveaux`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `parcours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`),
  ADD KEY `fk_parcours_specialites_idx` (`specialites_id`),
  ADD KEY `fk_parcours_niveaux_idx` (`niveaux_id`);

ALTER TABLE `pays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`);

ALTER TABLE `specialites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `libelle_UNIQUE` (`libelle`),
  ADD KEY `fk_specialites_filieres_idx` (`filieres_id`);

ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `anneeacademiques`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `civilites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `cycles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `decisions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `ecoles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `etudiants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `filieres`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `inscriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `niveaux`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `parcours`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `pays`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `specialites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `utilisateurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `ecolesfilieres`
  ADD CONSTRAINT `fk_ecoles_filieres_ecoles` FOREIGN KEY (`ecoles_id`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ecoles_filieres_filieres` FOREIGN KEY (`filieres_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `etudiants`
  ADD CONSTRAINT `fk_etudiants_civilites` FOREIGN KEY (`civilites_id`) REFERENCES `civilites` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_etudiants_pays` FOREIGN KEY (`pays_id`) REFERENCES `pays` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `inscriptions`
  ADD CONSTRAINT `fk_inscriptions_annee_academique` FOREIGN KEY (`annee_academique_id`) REFERENCES `anneeacademiques` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_decisions` FOREIGN KEY (`decisions_id`) REFERENCES `decisions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_etudiants` FOREIGN KEY (`etudiants_id`) REFERENCES `etudiants` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_parcours` FOREIGN KEY (`parcours_id`) REFERENCES `parcours` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `parcours`
  ADD CONSTRAINT `fk_parcours_niveaux` FOREIGN KEY (`niveaux_id`) REFERENCES `niveaux` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parcours_specialites` FOREIGN KEY (`specialites_id`) REFERENCES `specialites` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `specialites`
  ADD CONSTRAINT `fk_specialites_filieres` FOREIGN KEY (`filieres_id`) REFERENCES `filieres` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
