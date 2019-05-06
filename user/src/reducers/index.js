import app from 'reducers/app';
import appRouter from 'reducers/app/router';
import constant from 'reducers/constant';
import auth from './auth';
import voting from './voting';
import wallet from './wallet';
import oracle from './oracle';
import metamask from 'reducers/metamask';

export default {
  app,
  appRouter,
  constant,
  auth,
  voting,
  wallet,
  oracle,
  metamask,
};
