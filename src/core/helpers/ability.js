import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import get from 'lodash/get';
import { roleBasedAccessControl } from '@helpers/rbac';
import {
  CLIENT_ADMIN,
  VENDOR_ADMIN,
  TRAINING_ORGANISATION_MANAGER,
  COACH,
  AUXILIARY,
  PLANNING_REFERENT,
  ERP,
  TRAINER,
  INTRA,
  INTRA_HOLDING,
  HOLDING_ADMIN,
  INTER_B2B,
} from '@data/constants';
import router from 'src/router/index';

const getClientAbilities = (role, subscriptions) => roleBasedAccessControl[role]
  .filter(r => !r.subscription || subscriptions.includes(r.subscription))
  .map(r => r.name);

const getVendorAbilities = role => roleBasedAccessControl[role].map(r => r.name);

export const defineAbilitiesFor = (user) => {
  const isVendorInterface = /\/ad\//.test(router.currentRoute.value.path);
  const { role, company, _id, sector } = user;
  const clientRole = get(role, 'client.name');
  const vendorRole = get(role, 'vendor.name');
  const { can, rules } = new AbilityBuilder(createMongoAbility);

  const companySubscriptions = company
    ? Object.keys(company.subscriptions).filter(key => company.subscriptions[key])
    : [];
  if (clientRole) can('read', getClientAbilities(clientRole, companySubscriptions));
  if (vendorRole) can('read', getVendorAbilities(vendorRole));
  if (!clientRole && !vendorRole) can('read', 'account client');
  if (isVendorInterface && [VENDOR_ADMIN, TRAINING_ORGANISATION_MANAGER].includes(vendorRole)) {
    can('set', 'user_company');
    can('update', 'coursebilling');
  }
  if (isVendorInterface && [VENDOR_ADMIN, TRAINING_ORGANISATION_MANAGER, TRAINER].includes(vendorRole)) {
    can('update', 'course_trainee_follow_up');
  }

  if ((isVendorInterface && [VENDOR_ADMIN, TRAINING_ORGANISATION_MANAGER].includes(vendorRole)) ||
      [CLIENT_ADMIN, COACH, PLANNING_REFERENT].includes(clientRole)) can('read', 'learner_info');

  if (companySubscriptions.includes(ERP)) {
    if (clientRole === CLIENT_ADMIN) can('update', 'erp_config');

    if ([CLIENT_ADMIN, COACH, PLANNING_REFERENT].includes(clientRole)) can('update', 'Events');
    if (clientRole === AUXILIARY) {
      can('update', 'Events', { auxiliaryId: { $eq: _id } });
      can('update', 'Events', { sectorId: { $eq: sector } });
    }
  }
  return createMongoAbility(rules);
};

export const defineAbilitiesForCourse = (user) => {
  const isVendorInterface = /\/ad\//.test(router.currentRoute.value.path);
  const { role } = user;

  const { can, rules } = new AbilityBuilder(createMongoAbility);

  if (isVendorInterface) {
    const vendorRole = get(role, 'vendor.name');

    if ([VENDOR_ADMIN, TRAINING_ORGANISATION_MANAGER].includes(vendorRole)) {
      can('update', 'Course', 'company_representative', { type: { $in: [INTRA, INTRA_HOLDING] } });
      can('update', 'interlocutor');
      can('read', 'companies');
      can('update', 'Course', 'companies', { type: { $in: [INTER_B2B, INTRA_HOLDING] } });
    }
  } else {
    const holdingRole = get(role, 'holding.name');

    can('update', 'Course', 'company_representative', { type: INTRA });
    if ([HOLDING_ADMIN].includes(holdingRole)) {
      can('update', 'Course', 'company_representative', { type: INTRA_HOLDING });
      can('update', 'Course', 'companies', { type: INTRA_HOLDING });
    }
  }

  return createMongoAbility(rules);
};
