import { formatIdentity, sortStrings, removeDiacritics } from '@helpers/utils';
import Users from '@api/Users';

export const learnerDirectoryMixin = {
  data () {
    return {
      tableLoading: false,
      learnerList: [],
      pagination: { sortBy: 'name', descending: false, page: 1, rowsPerPage: 15 },
      columns: [
        {
          name: 'name',
          label: 'Nom',
          field: row => row.learner,
          align: 'left',
          sortable: true,
          sort: (a, b) => sortStrings(a.lastname, b.lastname),
        },
        {
          name: 'blendedCoursesCount',
          label: 'Formations mixtes',
          field: 'blendedCoursesCount',
          align: 'center',
          sortable: true,
        },
        {
          name: 'eLearningCoursesCount',
          label: 'Formations eLearning',
          field: 'eLearningCoursesCount',
          align: 'center',
          sortable: true,
        },
      ],
    };
  },
  methods: {
    formatRow (user) {
      const formattedName = formatIdentity(user.identity, 'FL');

      return {
        learner: {
          _id: user._id,
          fullName: formattedName,
          lastname: user.identity.lastname,
          picture: user.picture ? user.picture.link : null,
          noDiacriticsName: removeDiacritics(formattedName),
        },
        company: user.company ? user.company.name : 'N/A',
        blendedCoursesCount: user.blendedCoursesCount,
        eLearningCoursesCount: user.eLearningCoursesCount,
      };
    },
    async getLearnerList (companyId = null) {
      try {
        this.tableLoading = true;
        const learners = await Users.learnerList(companyId ? { company: companyId } : null);
        this.learnerList = Object.freeze(learners.map(this.formatRow));
      } catch (e) {
        console.error(e);
        this.learnerList = [];
      } finally {
        this.tableLoading = false;
      }
    },
  },
};
