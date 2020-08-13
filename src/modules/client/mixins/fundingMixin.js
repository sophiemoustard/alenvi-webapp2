import capitalize from 'lodash/capitalize';
import { getLastVersion } from '@helpers/utils';
import { days } from '@data/days';
import { FUNDING_FREQ_OPTIONS, NATURE_OPTIONS } from '@data/constants.js';

export const fundingMixin = {
  data () {
    return {
      fundings: [],
      selectedFunding: {},
      fundingsLoading: false,
      fundingsColumns: [
        {
          name: 'startDate',
          label: 'Date de début de prise en charge',
          align: 'left',
          format: value => value ? this.$moment(value).format('DD/MM/YYYY') : '',
          field: 'startDate',
        },
        {
          name: 'thirdPartyPayer',
          label: 'Tiers payeur',
          align: 'left',
          field: 'thirdPartyPayer',
          format: value => value ? value.name : '',
        },
        {
          name: 'nature',
          label: 'Nature',
          align: 'left',
          format: (value) => {
            const nature = NATURE_OPTIONS.find(option => option.value === value);
            return nature ? capitalize(nature.label) : '';
          },
          field: 'nature',
        },
        {
          name: 'folderNumber',
          label: 'Numéro de dossier',
          align: 'left',
          field: 'folderNumber',
        },
        {
          name: 'endDate',
          label: 'Date de fin de prise en charge',
          align: 'left',
          format: value => value ? this.$moment(value).format('DD/MM/YYYY') : '∞',
          field: 'endDate',
        },
        {
          name: 'frequency',
          label: 'Fréquence',
          align: 'left',
          format: value => this.frequencyFormat(value),
          field: 'frequency',
        },
        {
          name: 'amountTTC',
          label: 'Montant forfaitaire TTC',
          align: 'left',
          format: value => value ? `${value}€` : '',
          field: 'amountTTC',
        },
        {
          name: 'unitTTCRate',
          label: 'Prix unitaire TTC',
          align: 'left',
          format: value => value ? `${value}€` : '',
          field: 'unitTTCRate',
        },
        {
          name: 'careHours',
          label: 'Nb. heures de prise en charge',
          align: 'left',
          format: value => value ? `${value}h` : '',
          field: 'careHours',
        },
        {
          name: 'customerParticipationRate',
          label: 'Tx. participation bénéficiaire',
          align: 'left',
          format: value => value ? `${value}%` : '0%',
          field: 'customerParticipationRate',
        },
        {
          name: 'careDays',
          label: 'Jours de prise en charge',
          align: 'left',
          format: value => value && value.length > 0 ? value.map(day => days[day]).join(', ') : '',
          field: 'careDays',
        },
        {
          name: 'subscription',
          label: 'Souscription',
          align: 'left',
          format: value => value ? value.service.name : '',
          field: 'subscription',
        },
        {
          name: 'createdAt',
          label: '',
          align: 'left',
          field: 'createdAt',
        },
        {
          name: 'actions',
          label: '',
          align: 'left',
          field: '_id',
        },
      ],
    };
  },
  methods: {
    refreshFundings ({ fundings }) {
      try {
        this.fundingsLoading = true;
        this.fundings = fundings
          ? fundings.map(fund => ({ ...getLastVersion(fund.versions, 'createdAt'), ...fund }))
          : [];
      } catch (e) {
        console.error(e);
      } finally {
        this.fundingsLoading = false;
      }
    },
    careDaysFormat (value) {
      if (value && value.length > 0) {
        let daysArr = [...value];
        daysArr = daysArr.sort((a, b) => a - b);
        return daysArr.map(day => days[day]).join(', ');
      }
      return '';
    },
    frequencyFormat (value) {
      const freq = FUNDING_FREQ_OPTIONS.find(option => option.value === value);
      return freq ? capitalize(freq.label) : '';
    },
  },
};
