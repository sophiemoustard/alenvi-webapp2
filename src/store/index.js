import Vue from 'vue';
import Vuex from 'vuex';
import main from 'src/store/main';
import current from 'src/store/current';
import rh from 'src/modules/client/store/rh';
import planning from 'src/modules/client/store/planning';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    main,
    current,
    rh,
    planning,
  },
});

export default store;
