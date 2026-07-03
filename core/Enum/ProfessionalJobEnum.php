<?php

declare(strict_types=1);

namespace Core\Simulator\Enum;

enum ProfessionalJobEnum: int
{
    // Privé (10.xx)
    case CADRE_SUPERIEUR = 1001;
    case INGENIEUR = 1002;
    case CADRE_MOYEN = 1003;
    case TECHNICIEN = 1004;
    case CONTREMAITRE = 1005;
    case AGENT_SECURITE = 1006;
    case EMPLOYE = 1007;
    case OUVRIER_QUALIFIE = 1008;
    case OUVRIER_NON_QUALIFIE = 1009;
    case APPRENTI = 1010;

    // Public (20.xx)
    case CADRE_SUP_PUBLIC = 2001;
    case CADRE_MOYEN_PUBLIC = 2002;
    case OUVRIER_ETAT = 2003;
    case MILITAIRE_POMPIER = 2004;
    case AIDE_SOIGNANT = 2005;

    // Agricole (30.xx)
    case PROPRIETAIRE_AGRICOLE = 3001;
    case SALARIE_AGRICOLE = 3002;

    // Indépendant (40.xx)
    case CHEF_ENTREPRISE = 4001;
    case ARTISAN = 4002;
    case COMMERCANT = 4003;
    case VRP = 4004;
    case PROFESSION_LIBERALE_1 = 4005;
    case PROFESSION_LIBERALE_2 = 4006;

    // Retraité (50.xx)
    case RETRAITE_PRIVE = 5001;
    case RETRAITE_PUBLIC = 5002;

    // Étudiant (60.xx)
    case ETUDIANT = 6001;

    // Chômeur (70.xx)
    case DEMANDEUR_EMPLOI = 7001;

    // Inactif (80.xx)
    case SANS_PROFESSION = 8001;
    case INVALIDE_PENSIONNÉ = 8002;

    public function label(): string
    {
        return match ($this) {
                // Privé
            self::CADRE_SUPERIEUR => 'Cadre supérieur',
            self::INGENIEUR => 'Ingénieur',
            self::CADRE_MOYEN => 'Cadre moyen',
            self::TECHNICIEN => 'Technicien',
            self::CONTREMAITRE => 'Contremaître',
            self::AGENT_SECURITE => 'Agent de sécurité',
            self::EMPLOYE => 'Employé',
            self::OUVRIER_QUALIFIE => 'Ouvrier qualifié',
            self::OUVRIER_NON_QUALIFIE => 'Ouvrier non qualifié',
            self::APPRENTI => 'Apprenti',

                // Public
            self::CADRE_SUP_PUBLIC => 'Cadre supérieur (Public)',
            self::CADRE_MOYEN_PUBLIC => 'Cadre moyen (Public)',
            self::OUVRIER_ETAT => 'Ouvrier d\'État',
            self::MILITAIRE_POMPIER => 'Militaire / Pompier',
            self::AIDE_SOIGNANT => 'Aide soignant',

                // Agricole
            self::PROPRIETAIRE_AGRICOLE => 'Propriétaire agricole',
            self::SALARIE_AGRICOLE => 'Salarié agricole',

                // Indépendant
            self::CHEF_ENTREPRISE => 'Chef d\'entreprise',
            self::ARTISAN => 'Artisan',
            self::COMMERCANT => 'Commerçant',
            self::VRP => 'VRP',
            self::PROFESSION_LIBERALE_1 => 'Profession libérale',
            self::PROFESSION_LIBERALE_2 => 'Profession libérale (autre)',

                // Retraité
            self::RETRAITE_PRIVE => 'Retraité secteur privé',
            self::RETRAITE_PUBLIC => 'Retraité secteur public',

                // Étudiant
            self::ETUDIANT => 'Étudiant',

                // Chômeur
            self::DEMANDEUR_EMPLOI => 'Demandeur d\'emploi',

                // Inactif
            self::SANS_PROFESSION => 'Sans profession',
            self::INVALIDE_PENSIONNÉ => 'Invalide / Pensionné',
        };
    }

    /**
     * Retourne le secteur parent de cette profession
     */
    public function sector(): ProfessionalSectorEnum
    {
        $sectorCode = intdiv($this->value, 100);
        return match ($sectorCode) {
            10 => ProfessionalSectorEnum::PRIVE,
            20 => ProfessionalSectorEnum::PUBLIC ,
            30 => ProfessionalSectorEnum::AGRICOLE,
            40 => ProfessionalSectorEnum::INDEPENDANT,
            50 => ProfessionalSectorEnum::RETRAITE,
            60 => ProfessionalSectorEnum::ETUDIANT,
            70 => ProfessionalSectorEnum::CHOMEUR,
            80 => ProfessionalSectorEnum::INACTIF,
        };
    }

    public static function choices(): array
    {
        return array_reduce(
            self::cases(),
            fn($carry, $enum) => [...$carry, $enum->label() => $enum->value],
            []
        );
    }

    public static function values(): array
    {
        return array_map(fn($e) => $e->value, self::cases());
    }
}
