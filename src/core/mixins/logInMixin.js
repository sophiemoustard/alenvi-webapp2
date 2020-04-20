import get from 'lodash/get';
import Users from '@api/Users';

export const logInMixin = {
  methods: {
    async logInUser (authenticationPayload) {
      const auth = await Users.authenticate(authenticationPayload);

      const expiresInDays = parseInt(auth.expiresIn / 3600 / 24, 10) >= 1
        ? parseInt(auth.expiresIn / 3600 / 24, 10)
        : 1;
      const options = { path: '/', expires: expiresInDays, secure: process.env.NODE_ENV === 'production' };
      this.$q.cookies.set('alenvi_token', auth.token, options);
      this.$q.cookies.set('alenvi_token_expires_in', auth.expiresIn, options);
      this.$q.cookies.set('refresh_token', auth.refreshToken, { ...options, expires: 365 });
      this.$q.cookies.set('user_id', auth.user._id, options);
      await this.$store.dispatch('main/getLoggedUser', this.$q.cookies.get('user_id'));

      const loggedUser = this.$store.getters['main/loggedUser'];
      if (this.$route.query.from) return this.$router.replace({ path: this.$route.query.from });
      if (!get(loggedUser, 'role.client.name')) return this.$router.replace('/ad').catch(e => {});
      return this.$router.replace('/').catch(e => {});
    },
  },
}
