import Authentication from '@api/Authentication';
import store from 'src/store/index';

export const canNavigate = async () => {
  const { loggedUser } = store.state.main;
  if (!loggedUser) {
    const auth = await refreshAlenviCookies();
    if (auth) await store.dispatch('main/fetchLoggedUser', auth.user._id);
    else return false;
  }

  return true;
};

export const refreshAlenviCookies = async () => {
  try {
    const auth = await Authentication.refreshToken();
    return auth;
  } catch (e) {
    return false;
  }
};

export const refreshState = async () => {
  const auth = await refreshAlenviCookies();
  if (auth) {
    await store.dispatch('main/fetchLoggedUser', auth.user._id);
    return true;
  }

  return false;
};

export const isUserLogged = async () => {
  const refresh = await refreshAlenviCookies();
  if (!refresh) return false;

  await store.dispatch('main/fetchLoggedUser', refresh.user._id);
  const loggedUser = store.getters['main/getLoggedUser'];
  if (loggedUser) return true;

  await Authentication.logOut();
  return false;
};
