import { today } from 'src/utils/format-time';
import { _mock } from './_mock';

const DEMANDE_AUTORISATION_FOLDERS_NAMES = [
  "Pièce d'identité du demandeur",
  'Copie du contrail de bail',
  'Extrait de casier judiciaire francais',
  'Extrait de casier judiciaire luxembourgeois',
  'Déclaration de non-faillite - Sur rendez-vous notaire',
  'Projet de statut',
  'Copie des diplomes',
  'RIB de la société',
  'Formulaire rempli',
  'Timbre de chancellerie 50,00€',
];

const SARL_DOC_NAMES = [
  "Piece d'identité des associés",
  'ACTE DE CONSTITUTION - PRENDRE RENDEZ-VOUS NOTAIRE',
  'Contrat de bail signé',
  "Déclaration sur l'honneur",
];
const SARLS_DOC_NAMES = [
  "Piece d'identité des associés",
  'RIB société',
  'Contrat de bail signé',
  'Statuts (acte sous seing privé)',
  'Preuve de dépots des statuts au LBR',
];

const DECLARATION_IMPOT_NAMES = [
  'Certificat de rémunération annuel',
  'Intérêts débiteurs',
  'Assurances',
  'Assurance prévoyance vieillesse',
  'Epargne logement',
  'Dons',
  'Charges extraordinaires',
  'Déclaration de partenariat',
  'Une copie du décompte annuel ou de la déclaration d’impôts de l’année précédente',
  'Revenus locatifs',
];

export const DEMANDE_AUTORISATION_FOLDERS = DEMANDE_AUTORISATION_FOLDERS_NAMES.map(
  (name, index) => ({
    id: `${_mock.id(index)}_folder`,
    type: `${name.split('.').pop()}`,
    name,
    createdAt: today(),
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit amet sequi delectus dolores animi rem maxime perferendis, repellat, ut quia nam obcaecati suscipit optio consequuntur sapiente, in dolorem ipsam iusto.',
  })
);

export const SARL_DOC = SARL_DOC_NAMES.map((name, index) => ({
  id: `${_mock.id(index)}_folder`,
  type: `${name.split('.').pop()}`,
  name,
  createdAt: today(),
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit amet sequi delectus dolores animi rem maxime perferendis, repellat, ut quia nam obcaecati suscipit optio consequuntur sapiente, in dolorem ipsam iusto.',
}));

export const SARLS_DOC = SARLS_DOC_NAMES.map((name, index) => ({
  id: `${_mock.id(index)}_folder`,
  type: `${name.split('.').pop()}`,
  name,
  createdAt: today(),
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit amet sequi delectus dolores animi rem maxime perferendis, repellat, ut quia nam obcaecati suscipit optio consequuntur sapiente, in dolorem ipsam iusto.',
}));

export const DECLARATION_IMPOT = DECLARATION_IMPOT_NAMES.map((name, index) => ({
  id: `${_mock.id(index)}_folder`,
  type: `folder`,
  createdAt: today(),
  name,
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit amet sequi delectus dolores animi rem maxime perferendis, repellat, ut quia nam obcaecati suscipit optio consequuntur sapiente, in dolorem ipsam iusto.',
}));
